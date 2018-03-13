define(
    'default',
    [
        'app',
        'text!templates/default.tpl',
        'helpers/settings/widget-types',
        'helpers/strings/parse-url-params',
        'helpers/cache',
        'helpers/auth/check-cookies',
        'helpers/ajax/ajax-wrapper'
    ],
    function(App, tpl, widgetTypes, parseUrlParams, Cache, checkCookies, Ajax) {
        var widgetMainView = App.View.defaultView.extend({
            el: '#body',
            widgetCodeToken: null,
            widgetEventsHandler: null,
            styles: {},
            googleAnalyticsTrackerName: '/widget',
            pollsCount: 0,
            rotationInterval: 10000,
            votesCounter: 0,
            votesCounterExpirationTime: 240,
            rotationIntervalId: null,
            rotationTimeoutId: null,
            isMouseOver: false,
            isVotingPanelActive: true,
            isRotationStarted: false,
            isRotationEnabled: true,
            isStickyPoll: false,
            isWidgetVisibleOnPage: false,
            isPartnerPageActive: true,
            partnerPageUrl: null,
            isResizableWidget: false,
            adUnitVotesCounter: 0,
            adUnitDisplay: true,
            initialize: function() {
                var self = this;

                self.eventsListenerInit();
                self.prepareCss(self.prepareTpl(tpl));
                self.resizeWidgetHeight();
                self.partnerPageUrl = decodeURIComponent(owPreparedData.urlArguments.location);

                if ('rotationFrequency' in widgetTypes) {
                    self.rotationInterval = widgetTypes.rotationFrequency * 1000;
                    self.rotationInterval = (self.rotationFrequency - 0) ? self.rotationFrequency * 1000 : self.rotationInterval;
                }

                window.onresize = _.debounce(function() {
                    self.onWindowResize();
                }, 200);

                self.postMessage('action', {
                    method: 'pushStyles',
                    arguments: [self.token, self.styles.main]
                });

                self.postMessage('action', {
                    method: 'pushBannerProp',
                    arguments: [self.token, self.adUnits]
                });

                if (!_.isEmpty(self.adUnits)) {
                    self.initializeAdView();
                }

                self.postMessage('action', {
                    method: 'checkWidgetVisibility',
                    arguments: ['actionWithArguments', self.token, 'setWidgetVisibility']
                });

                self.dimension1 = self.widgetCode;
                self.dimension3 = (self.partner !== null ? self.partner.externalId : undefined);

                ga('set', 'dimension1', self.dimension1);
                ga('set', 'dimension3', self.dimension3);
                ga('set', 'dimension4', widgetTypes.customType);
                ga('send', 'pageview', self.googleAnalyticsTrackerName);
                self.onInitialize();
            },
            eventsListenerInit: function() {
                var self = this,
                    eventMethod = window.addEventListener ? "addEventListener" : "attachEvent",
                    messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message",
                    widgetListenerInit = window[eventMethod];

                self.widgetEventsHandler = function (event) {
                    var message = event.data;

                    if (message) {
                        switch (message.type) {
                            case 'action':
                            case 'actionForChildsView':
                                if ('function' === typeof self[message.data.method]) {
                                    self[message.data.method]();
                                }
                            break;

                            case 'actionWithArguments':
                                if ('function' === typeof self[message.data.method]) {
                                    self[message.data.method](message.data);
                                }
                            break;
                        }
                    }
                };

                widgetListenerInit(messageEvent, self.widgetEventsHandler, false);
            },
            prepareCss: function() {
                var self = this,
                    re = /<css[\s\t]+id=\"((?!\")\w+)\"[\s\t]*>(((?!<\/css).)*)<\/css>/g;

                tpl.replace(/(\r\n|\n|\r)/gm, "").replace(re, function(matchStr, id, css) {
                    self.styles[id] = css;
                });
            },
            postMessage: function(type, data) {
                parent.postMessage({
                    type: type,
                    data: data
                }, '*');
            },
            resizeWidgetHeight: function(params) {
                var self = this,
                    widgetParams = ('undefined' !== typeof params) ? params : {},
                    widgetWidth,
                    widgetHeight = widgetParams.height || self.minHeight;

                    if (widgetParams.width && !self.isResizableWidget) {
                        widgetWidth = widgetParams.width + 'px';
                    }
                    else if (!parseInt(self.width) || self.isResizableWidget) {
                        widgetWidth = '100%';
                    }
                    else {
                        widgetWidth = self.width + 'px';
                    }
                    if (self.headerTitleState === 'hidden') widgetHeight = widgetHeight - self.headerHeight;
                    //if (widgetHeight < self.minHeight) widgetHeight = self.minHeight;

                self.postMessage('action', {
                    method: 'resize',
                    arguments: [self.token, widgetWidth, widgetHeight + 'px']
                });
            },
            initializeAdView: function() {
                var self = this;

                require(['js/banners'], function(bannerConstructors) {
                    var adMatching = {
                        'top': 'adUnitPlacementOnTop',
                        'bottom': 'adUnitPlacementOnBottom',
                        'pollRotation': 'adUnitInPollRotationDialog'
                    };

                    self.adUnitPlacementOnTop = new bannerConstructors.adUnitPlacementOnTop({parent: self});
                    self.adUnitPlacementOnBottom = new bannerConstructors.adUnitPlacementOnBottom({parent: self});
                    self.adUnitInPollRotationDialog = new bannerConstructors.bannerInPollRotationDialog({parent: self});

                    _.each(self.adUnits, function(banner) {
                        self[adMatching[banner.placement]].initializeBannerSettings(banner, self.token);
                    });

                    self.adInitialized = true;
                });
            },
            setBannerVisibility: function(visibility) {
                var self = this;

                if (self.adInitialized) {
                    self.adUnitPlacementOnTop.isVisible = visibility.isBannerVisible.top;
                    self.adUnitPlacementOnBottom.isVisible = visibility.isBannerVisible.bottom;
                }
            },
            setWidgetVisibility: function(visibility) {
                var self = this;

                self.isWidgetVisibleOnPage = visibility.isWidgetVisible;

                if (self.isWidgetVisibleOnPage && !self.isFirstPollViewed) {
                    self.trigger('trackView');
                }
            },
            setPageStatus: function(activeTab) {
                var self = this,
                    partnerPageParams = activeTab.partnerActivePageParams;

                if (!partnerPageParams.isBlured && partnerPageParams.isFocused) {
                    self.isPartnerPageActive = true;
                }
                else {
                    self.isPartnerPageActive = false;
                }
            },
            showNextPoll: function() {
                var self = this;

                if (0 < self.pollsCollection.length) {
                    clearTimeout(self.rotationTimeoutId);
                    self.pollsCollection.next();
                    self.showPoll();
                    self.showVotingPanel();
                    self.isStickyPoll = false;
                }
                return self;
            },
            showPrevPoll: function() {
                var self = this;
                if (0 < self.pollsCollection.length) {
                    clearTimeout(self.rotationTimeoutId);
                    self.pollsCollection.prev();
                    self.showPoll();
                    self.showVotingPanel();
                    self.isStickyPoll = false;
                }
                return self;
            },
            voteForSide: function(pollSideId, voteToken, callback) {
                var self = this,
                    voteCallback;

                voteCallback = function() {
                    Ajax({
                        url: App.config.URL_SERVER_API_NEW + 'poll-vote/poll-side/' + voteToken,
                        type: 'POST',
                        showLoader: false,
                        data: {
                            sourceType: 'trivia',
                            sourceCode: self.widgetCode,
                            increaseView: true,
                            urlVotedFrom: self.partnerPageUrl
                        },
                        success: function(data) {
                            var poll = self.pollsCollection.getCurrentElement(),
                                lastVotedSide = poll.get('sides').get(poll.get('votedForSide')),
                                newVotedSide = poll.get('sides').get(pollSideId);

                            if (lastVotedSide) {
                                poll.set({'totalVotes': poll.get('totalVotes') - 1});
                                lastVotedSide.set({votes: lastVotedSide.get('votes') - 1});
                            }

                            if (data && data.id) {
                                poll.set({'voteId': data.id});
                            }

                            poll.set({'totalVotes': poll.get('totalVotes') + 1});
                            newVotedSide.set({'votes': newVotedSide.get('votes') + 1});
                            poll.set({'votedForSide': ''});
                            poll.set({'votedForSide': pollSideId});
                            poll.get('sides').recalculatePercentageOfSides(poll.get('totalVotes'));
                            if (callback) callback.apply(this, arguments);
                            ga('send', 'event', 'poll_vote', '' + poll.get('id') + '', '' + pollSideId + '');

                            if (self.isStickyPoll) {
                                self.rotationTimeoutId = setTimeout(function() {
                                    self.isStickyPoll = false;
                                    clearInterval(self.rotationIntervalId);
                                    self.showNextPoll();
                                }, 20000);
                            }
                        }
                    });
                };

                checkCookies(voteCallback);
            },
            getPollsByTag: function(callback, relatedMode, tagId) {
                var self = this,
                    dataToSend = {};

                dataToSend.widgetCode = self.widgetCode;
                dataToSend.locale = self.displayLocale;
                dataToSend.limit = 3;

                if (relatedMode) {
                    dataToSend.relatedMode = relatedMode;
                    dataToSend.tagIds = tagId;
                }

                Ajax({
                    url: App.config.URL_SERVER + 'TagFindNonVotedPollsByTags',
                    type: 'POST',
                    data: dataToSend,
                    success: function(data) {
                        if (data && 'com.oneworldonline.backend.apiresults.Error' !== data.type) {
                            self.polls = data;
                            self.pollsCollection = self.createPollsCollection(self.polls);
                            callback.apply(self, arguments);
                        }
                    }
                });
            },
            saveVotesCounterInCache: function() {
                var self = this;

                if (self.enableConversionWindow) {
                    try {
                        Cache.write('widgetVotesCounter_' + self.widgetCode, self.votesCounter, self.votesCounterExpirationTime);
                    }
                    catch (eventError) {}
                }

                if (self.adUnitDisplay) {
                    try {
                        Cache.write('widgetAdUnitVotesCounter_' + self.widgetCode, self.adUnitVotesCounter, self.votesCounterExpirationTime);
                    }
                    catch (eventError) {}
                }
            },
            incrementWidgetVotesCounter: function() {
                var self = this;

                if (self.enableConversionWindow) {
                    self.votesCounter = parseInt(Cache.read('widgetVotesCounter_' + self.widgetCode)) + 1;
                }
                if (self.adUnitDisplay) {
                    var votesCounter = parseInt(Cache.read('widgetAdUnitVotesCounter_' + self.widgetCode)) + 1;
                    increment(votesCounter);
                }

                //for safari
                function increment(vote) {
                    if (isNaN(vote)) self.adUnitVotesCounter += 1;
                    if (!isNaN(vote)) self.adUnitVotesCounter = parseInt(Cache.read('widgetAdUnitVotesCounter_' + self.widgetCode)) + 1;
                }

                self.saveVotesCounterInCache();
            },
            trackWidgetLoading: function() {
                var self = this;

                Ajax({
                    url: App.config.URL_SERVER_API_NEW + 'widget/' + self.widgetCode + '/location',
                    showLoader: false,
                    type: 'GET',
                    data: {
                        location: self.partnerPageUrl,
                        deviceType: 'desktop'
                    }
                });
            },
            trackBannerRender: function(widgetCode, adUnitId) {
                var self = this;

                Ajax({
                    url: App.config.URL_SERVER_REST + 'adunit/view',
                    showLoader: false,
                    type: 'GET',
                    data:{
                        widgetCode: widgetCode,
                        adUnitId: adUnitId,
                        location: self.partnerPageUrl
                    },
                    dataType: 'json'
                });
            },
            pollVoteMove: function(callback) {
                var self = this;

                Ajax({
                    url: App.config.URL_SERVER_API_NEW + 'poll-vote/move/widget/' + self.widgetCode,
                    type: 'POST',
                    success: function(data) {
                        if (callback) callback.apply(self, arguments);
                    }
                });
            },
            getRelatedTag: function(callback) {
                var self = this;

                Ajax({
                    url: App.config.URL_SERVER_API_NEW + 'tag/related/widgetCode/' + self.widgetCode,
                    showLoader: false,
                    type: 'GET',
                    success: function(data) {
                        if (data.length > 0) {
                            callback.call(self, data[0].name, data[0].id);
                        }
                    }
                });
            }
        });

        return widgetMainView;
    }
);
