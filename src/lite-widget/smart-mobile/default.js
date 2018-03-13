define(
	'default',
	[
		'app',
		'text!templates/default.tpl',
        'helpers/settings/widget-types',
        'helpers/cache',
        'helpers/auth/check-cookies',
        'helpers/ajax/ajax-wrapper'
	],
    function (App, tpl, widgetTypes, Cache, checkCookies, Ajax) {
    	var widgetMainView = App.View.defaultView.extend({
            el: '#body',
            widgetEventsHandler: null,
            styles: {},
            googleAnalyticsTrackerName: '/widget',
            pollsToFetch: 3,
            pollsCount: 0,
            votesCounter: 0,
            votesCounterExpirationTime: 240,
            isVotingPanelExpend: false,
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
                self.getPartnerPageUrl();
                
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
                ga('set', 'dimension5', 'mobile');
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
            getPartnerPageUrl: function() {
                var self = this,
                    encodedLocation = decodeURIComponent(owPreparedData.urlArguments.location);

                self.partnerPageUrl = encodedLocation;
            },
            resizeWidgetHeight: function(params) {
                var self = this,
                    widgetParams = ('undefined' !== typeof params) ? params : {},
                    widgetWidth,
                    widgetHeight = widgetParams.height || self.minHeight,
                    widgetMinWidth = widgetParams.minWidth || self.minWidth;

                    if (widgetParams.width && !self.isResizableWidget) {
                        widgetWidth = widgetParams.width + 'px';
                    } 
                    else if (!parseInt(self.width) || self.isResizableWidget) {
                        widgetWidth = '100%';
                    }
                    else {
                        widgetWidth = self.width + 'px';
                    }
                    if ( !self.showHeader ) widgetHeight = widgetHeight - self.headerHeight;
                    //if (widgetHeight < self.minHeight) widgetHeight = self.minHeight;

                self.postMessage('action', {
                    method: 'resize',
                    arguments: [self.token, widgetWidth, widgetHeight + 'px', widgetMinWidth + 'px']
                });
            },
            initializeAdView: function() {
                var self = this;

                require(['js/banners'], function(bannerConstructors) {
                    var adMatching = {
                        'top': 'adUnitPlacementOnTop',
                        'left': 'adUnitPlacementOnLeft',
                        'right': 'adUnitPlacementOnRight',
                        'bottom': 'adUnitPlacementOnBottom',
                        'pollRotation': 'adUnitInPollRotationDialog'
                    };

                    self.adUnitPlacementOnTop = new bannerConstructors.adUnitPlacementOnTop({parent: self});
                    self.adUnitPlacementOnLeft = new bannerConstructors.adUnitPlacementOnLeft({parent: self});
                    self.adUnitPlacementOnRight = new bannerConstructors.adUnitPlacementOnRight({parent: self});
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
                        sourceType: 'poller',
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
                        poll.set({'votedForSide': pollSideId});
                        poll.get('sides').recalculatePercentageOfSides(poll.get('totalVotes'));
                        if (callback) callback.apply(this, arguments);

                        ga('send', 'event', 'poll_vote', '' + poll.get('id') + '', '' + pollSideId + '');

                        if (self.isStickyPoll) {
                                self.isStickyPoll = false;
                                self.showNextPoll();
                            }
                        }
                    });
                };

                if (self.redirectByVote
                && self.pollsCollection.getCurrentElement().get('relatedUrl')
                && !self.pollsCollection.getCurrentElement().isRelatedToCurrentUrl) {
                    window.open(self.pollsCollection.getCurrentElement().get('relatedUrl'));
                }
                checkCookies(voteCallback);
            },
            getPolls: function(callback) {
                var self = this;

                Ajax({
                    url: App.config.URL_SERVER_API_NEW + 'poll/widget/' + self.widgetCode + '/' + self.displayLocale,
                    cacheIfNoSession: true,
                    type: 'GET',
                    data: {
                        pageSize: self.pollsToFetch,
                        location: self.partnerPageUrl
                    },
                    success: function(data) {
                        if (data && 'com.oneworldonline.backend.apiresults.Error' !== data.type) {
                            self.polls = data;
                            self.pollsCount = self.polls.length;
                            self.pollsCollection = self.createPollsCollection(self.polls);

                            if (0 < self.pollsCollection.length) {
                                for (var attr in self.polls) {
                                    self.excludedPolls.push(self.polls[attr].id);
                                }

                                if (self.pollsCollection.getCurrentElement().isRelatedToCurrentUrl && !self.pollsCollection.getCurrentElement().get('votedForSide')) {
                                    self.isStickyPoll = true;
                                }

                                callback.apply(self, arguments);
                                self.saveVotesCounterInCache();
                            }
                            else {
                                self.isEmptyPoll = true;
                                self.initializedEmptyPoll();
                            }
                        }
                    }
                });

                return self;
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
                        deviceType: 'mobile'
                    }
                });
            },
            trackBannerRender: function(widgetCode, adUnitId) {
                var self = this;

                Ajax({
                    url: App.config.URL_SERVER_API_NEW + 'adunit/'+ adUnitId +'/view',
                    showLoader: false,
                    type: 'GET',
                    data: {
                        widgetCode: widgetCode,
                        location: self.partnerPageUrl
                    }
                });
            },
            trackPollViews: function(currentPoll) {
                var self = this,
                    pollObjectProp = currentPoll;

                if (!pollObjectProp.hasOwnProperty('isViewed') && !pollObjectProp.get('voted') && self.isWidgetVisibleOnPage && self.isPartnerPageActive) {
                    Ajax({
                        url: App.config.URL_SERVER_API_NEW + 'poll/' + pollObjectProp.id +'/view',
                        showLoader: false,
                        type: 'POST'
                    });
                }

                if (!self.isFirstPollViewed) {
                    self.isFirstPollViewed = true;
                }

                pollObjectProp.isViewed = true;
            }
    	});

		return widgetMainView;
    }
);
