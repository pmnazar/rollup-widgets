define(
    'smart-mobile/smart',
    [
        'app',
        'default',
        'common/js/modules/sharing',
        'collections/smart-collection',
        'models/smart-multiside-poll-model',
        'helpers/statistic/to-friendly-number',
        'helpers/strings/hex-convert',
        'helpers/images',
        'helpers/ajax/ajax-wrapper',
        'helpers/settings/is-white-label-holding',
        'text!smart-mobile-mini/templates/smart.tpl',
        'libs/touch',
        'libs/fx'
    ],
    function (App, initView, sharingDialog, smartCollection, multisidePollModel, toFriendlyNubmer, hexConvert, Img, Ajax, isWhiteLabelHolding, tpl) {
        var smartView = initView.extend({
            currentPollElement: null,
            isEmptyPoll: false,
            isRender: false,
            isFirstPollViewed: false,
            isBulletsShown: false,
            showSocialButton: false,
            isVotingScreenShowed: false,
            asyncFetch: null,
            requestNewPolls: true,
            excludedPolls: [],
            templates: {
                baseTpl: 'tplWidgetBase',
                pollTpl: 'tplWidgetPollBase',
                optionsTpl: 'tplWidgetOptions',
                shareTpl: 'tplWidgetShare',
                bulletsTpl: 'tplWidgetPageBullets'
            },
            selector: {
                base: '#widget-slide-wrapper',
                bullets: '#bullets-nav',
                bulletsList: '.js-bullets-list',
                optionsBlock: '.js-options-block',
                shareBlock: '.js-share-block',
                backBtn: '.js-back-btn'
            },
            events: {
                'swipeLeft #widget-slide-wrapper': 'nextPollInRotation',
                'swipeRight #widget-slide-wrapper': 'prevPollInRotation',
                'singleTap .js-show-poll': 'showPollData',
                'tap .js-show-sharing-btn': 'showSharingDialog',
                'tap .js-back-btn': 'inPollNavigation',
                'change .js-poll-vote': 'vote',
                'click .js-learn-more': 'registerClickOnLearnMore',
                'click .js-one-index': 'registerClickAction',
                'tap .js-fb-share-btn': 'fbShare',
                'tap .js-g-plusone-share-btn': 'gPlusOneShare',
                'tap .js-twitter-share-btn': 'twitterShare',
                'tap .js-linked-in-share-btn': 'linkedInShare',
                'tap .js-weibo-share-btn': 'weiboShare',
                'tap .js-vk-share-btn': 'vkShare',
                'tap .js-prevent-click': 'preventClick'
            },
            onInitialize: function() {
                var self = this;

                self.childs = {};
                self.templatesObject = self.prepareTpl(tpl);
                self.getPolls(function() {
                    self.isEmptyPoll = false;
                    self.startTrackView();
                    self.initializeCollectionEvents();
                    self.render();
                    self.trackWidgetLoading();
                });

                self.childs.sharingDialog = new sharingDialog({ parent: self });

                self.postMessage('action', {
                    method: 'getPageStatus',
                    arguments: ['actionWithArguments', self.token, 'setPageStatus']
                });
            },
            initializedEmptyPoll: function() {
                var self = this;

                self.render();
            },
            startTrackView: function() {
                var self = this,
                    poll = self.pollsCollection.getCurrentElement();

                self.listenTo(self, 'trackView', function() {
                    self.trackPollViews(poll);
                    if (self.isFirstPollViewed) {
                        self.stopListening(self, 'trackView');
                    }
                });
            },
            initializeCollectionEvents: function() {
                var self = this;

                self.listenTo(self, 'lastCollectionUpdate', function(count) {
                    this.pollsCollection.newPollsInCollection = count;
                });
            },
            render: function() {
                var self = this;

                if (!self.isRender) {
                    self.$el.html(self.getTemplate(self.templates.baseTpl, self.templatesObject, {
                        containerWidth: self.pollsCount * self.width,
                        isEmptyPoll: self.isEmptyPoll
                    }));

                    self.isRender = true;
                }

                if (!self.isEmptyPoll) {
                    if (!self.isBulletsShown) self.showPollsBullets();
                    self.showPoll();
                }
            },
            showPollsBullets: function() {
                var self = this;

                self.$(self.selector.bullets).html(self.getTemplate(self.templates.bulletsTpl, self.templatesObject, {
                    qty: (self.pollsCollection.length > 1) ? 3 : 0
                }));
            },
            showPoll: function() {
                var self = this,
                    partner = self.partner;

                self.isWhiteLabel = isWhiteLabelHolding(partner);

                if (self.isWhiteLabel) {
                    self.partnerName = partner.parentObject ? partner.parentObject.name : partner.name;
                }

                self.$(self.selector.base).html(self.getTemplate(self.templates.pollTpl, self.templatesObject, {
                    polls: self.pollsCollection,
                    partnerName: self.partnerName,
                    widgetCode: self.widgetCode,
                    locale: self.displayLocale,
                    showLearnMore: self.showLearnMore,
                    toFriendlyNubmer: toFriendlyNubmer,
                    pollTaglineTextColor: self.pollTaglineTextColor,
                    pollsNumber: self.pollsCollection.length,
                    votingButtonsColor: self.votingButtonsColor,
                    pollRotationArrowsColor: self.pollRotationArrowsColor,
                    isEmptyPoll: self.isEmptyPoll,
                    config: App.config,
                    isWhiteLabel: self.isWhiteLabel,
                    frontStatic: App.config.DEBUG_MODE ? App.config.FRONT_STATIC_DEBUG_WIDGET : App.config.FRONT_STATIC
                }));

                Img.resizeImages();
            },
            moveToPoll: function(direction) {
                var self = this,
                    $pollWrapper = self.$(self.selector.base),
                    poll = self.pollsCollection.getCurrentElement(),
                    pollIndex = self.pollsCollection.currentElementIndex,
                    nextPoll = pollIndex * self.width;

                $pollWrapper.animate({
                    left: -nextPoll,
                    complete: self.cleanCurrentPollState()
                }, 500,
                'ease-out');
                
                self.$(self.selector.bulletsList).removeClass('on-white');
                self.trackPollViews(poll);
                self.setActivePollBullet();
            },
            setActivePollBullet: function() {
                var self = this,
                    $bulletsList = self.$(self.selector.bulletsList);
                    $activeBullet = $bulletsList.find('.current-poll');
                
                $activeBullet.removeClass('current-poll');
                if ($activeBullet.next().length) {
                    $activeBullet.next().addClass('current-poll');    
                }
                else {
                    $bulletsList.find('li').first().addClass('current-poll');
                }
                
            },
            showPollData: function() {
                var self = this,
                    currentPoll = self.pollsCollection.getCurrentElement(),
                    pollId = currentPoll.get('id'),
                    pollContainer = self.$(self.selector.base).find("[data-poll-id='" + pollId + "']");

                self.currentPollElement = pollContainer;

                if (!self.isVotingScreenShowed) {
                    self.showVotingScreen();
                    self.isVotingScreenShowed = true;
                }
            },
            showVotingScreen: function() {
                var self = this,
                    poll = self.pollsCollection.getCurrentElement(),
                    currentPollSides = poll ? poll.get('sides') : [],
                    $pollContainer = self.$(self.currentPollElement).find(self.selector.optionsBlock);

                $pollContainer.html(self.getTemplate(self.templates.optionsTpl, self.templatesObject, {
                    hexConvert: hexConvert,
                    locale: self.displayLocale,
                    widgetCode: self.widgetCode,
                    showLearnMore: self.showLearnMore,
                    poll: poll,
                    sides: currentPollSides,
                    votingButtonsColor: self.votingButtonsColor,
                    pollTaglineTextColor: self.pollTaglineTextColor,
                    backgroundColor: self.backgroundColor,
                    backgroundTransparency: self.backgroundTransparency
                })).show();

                self.$(self.selector.bulletsList).addClass('on-white');
            },
            showSharingDialog: function() {
                var self = this,
                    poll = self.pollsCollection.getCurrentElement(),
                    $pollContainer = self.$(self.currentPollElement).find(self.selector.optionsBlock),
                    $shareContainer = self.$(self.currentPollElement).find(self.selector.shareBlock);
                    
                if (poll) {
                    $shareContainer.html(self.getTemplate(self.templates.shareTpl, self.templatesObject, {
                        poll: poll,
                        widgetCode: self.widgetCode,
                        locale: self.displayLocale,
                        votingButtonsColor: self.votingButtonsColor,
                        showLearnMore: self.showLearnMore,
                        showFBLike: self.showFBLike,
                        showTwitterLike: self.showTwitterLike,
                        showGooglePlusLike: self.showGooglePlusLike,
                        showLinkedInLike: self.showLinkedInLike,
                        showWeiboSharing: self.showWeiboSharing,
                        showVkontakteSharing: self.showVkontakteSharing
                    })).show();
                }
            },
            inPollNavigation: function(e) {
                var self = this,
                    navigationMap = {
                        'option': self.selector.optionsBlock,
                        'share': self.selector.shareBlock
                    },
                    scrType = $(e.currentTarget).data('scr');

                if (scrType === 'option') {
                    self.isVotingScreenShowed = false;
                    self.$(self.selector.bulletsList).removeClass('on-white');
                }

                self.$(self.currentPollElement).find(navigationMap[scrType]).html('').hide();
            },
            nextPollInRotation: function(event) {
                var self = this,
                    currentElementIndex = self.pollsCollection.currentElementIndex;

                if (currentElementIndex + 1 === self.pollsCollection.length && self.requestNewPolls) {
                    $.when(self.fetchNewPolls('next'), self.asyncFetch).then(function() {
                        self.showNextPoll();
                    });
                }
                else {
                    self.showNextPoll();
                }

                self.isVotingScreenShowed = false;

                if (self.adInitialized) {
                    self.adUnitInPollRotationDialog.showNextPoll();
                    self.trigger('refreshTopBottomJsAdUnit', 'userPrevNextAction');
                }  
            },
            prevPollInRotation: function() {
                var self = this,
                    currentElementIndex = self.pollsCollection.currentElementIndex;

                if (currentElementIndex === 0 && self.requestNewPolls) {
                    $.when(self.fetchNewPolls('prev'), self.asyncFetch).then(function() {
                        self.showPrevPoll();
                    });
                }
                else {
                    self.showPrevPoll();
                }

                self.isVotingScreenShowed = false;

                if (self.adInitialized) {
                    self.trigger('refreshTopBottomJsAdUnit', 'userPrevNextAction');
                }  
            },
            vote: function(e) {
                var self = this,
                    element = $(e.currentTarget),
                    poll = self.pollsCollection.getCurrentElement();

                e.stopImmediatePropagation();
                if ('closed' !== poll.get('status')) {
                    self.voteForSide(element.data('pollSideId'), element.data('voteToken'), function() {
                        self.votingCallback(self);
                        self.showVotingScreen();
                    });
                }

                return self;
            },
            votingCallback: function(view) {
                var self = view;
                
                self.incrementWidgetVotesCounter();
                
                if (self.adInitialized) {
                    self.adUnitInPollRotationDialog.processVoting();
                    self.trigger('refreshTopBottomJsAdUnit', 'userVoteAction');
                    self.trigger('refreshLeftRightAdunit', 'userVoteAction');
                }
            },
            fetchNewPolls: function(moveTo) {
                var self = this;

                self.asyncFetch = $.Deferred();
                return Ajax({
                    url: App.config.URL_SERVER_API_NEW + 'poll/widget/' + self.widgetCode + '/' + self.displayLocale,
                    cacheIfNoSession: true,
                    type: 'GET',
                    contentType: 'application/json',
                    showLoader: true,
                    data: {
                        pageSize: self.pollsToFetch,
                        location: self.partnerPageUrl,
                        excluded: self.excludedPolls.toString(),
                        mobileMode: true
                    },
                    success: function(models) {
                        for (var attr in models) {
                            self.excludedPolls.push(models[attr].id);
                        }

                        switch (moveTo) {
                            case 'prev':
                                self.trigger('lastCollectionUpdate', models.length);
                                self.pollsCollection.unshift(models.reverse(), { silent: true, remove: false });
                                break;
                            case 'next':
                                self.trigger('lastCollectionUpdate', models.length);
                                self.pollsCollection.push(models, { silent: true, remove: false });
                                break;
                        }

                        if (models.length === 0) self.requestNewPolls = false;
                        self.pollsCount = self.pollsCollection.length;
                        self.$(self.selector.base).width(self.pollsCount * self.width);
                        self.showPoll();
                        self.asyncFetch.resolve();
                    }
                });
            },
            createPollsCollection: function(polls) {
                var self = this,
                    pollsCollection;

                pollsCollection = smartCollection.extend({
                    currentPageLink: document.createElement('a'),
                    newPollsInCollection: 0,
                    'model': multisidePollModel.extend({
                        isRelatedToCurrentUrl: false,
                        relatedUrlLink: document.createElement('a'),
                        afterInitialize: function() {
                            var self = this;

                            self.checkRelationToUrl();
                        },
                        checkRelationToUrl: function() {
                            var self = this;
                            
                            if (self.get('relatedUrl')) {
                                self.relatedUrlLink.href = self.get('relatedUrl');

                                if (self.relatedUrlLink.hostname.replace(/^(https?:\/\/)?(www\.)?/, '') === 
                                    self.collection.currentPageLink.hostname.replace(/^(https?:\/\/)?(www\.)?/, '') &&
                                    self.relatedUrlLink.pathname === self.collection.currentPageLink.pathname &&
                                    self.relatedUrlLink.hash === self.collection.currentPageLink.hash
                                ) {
                                    var relatedUrlLinkSearch = self.relatedUrlLink.search;
                                    var currentPageLinkSearch = self.collection.currentPageLink.search;

                                    if (!relatedUrlLinkSearch && !currentPageLinkSearch) {
                                        self.isRelatedToCurrentUrl = true;
                                    }
                                    else {
                                        var pollLink = self.relatedUrlLink,
                                            pageLink = self.collection.currentPageLink;
                                        
                                        if (relatedUrlLinkSearch === currentPageLinkSearch) {
                                            self.isRelatedToCurrentUrl = true;
                                        }
                                        if (pageLink.href.indexOf(pollLink.hash) !== -1) {
                                            self.isRelatedToCurrentUrl = true;
                                        }
                                    }
                                }
                            }
                        }
                    }),
                    initialize: function(models, widgetSettings) {
                        var self = this;

                        self.widgetLocation = decodeURIComponent(widgetSettings.location);
                        self.currentPageLink.href = self.widgetLocation;
                    }
                });

                return new pollsCollection(polls, {
                    location: self.location
                });
            },
            registerClickOnLearnMore: function(e) {
                var self = this,
                    elem = self.$(e.currentTarget).attr('class');

                self.sendClickAction('insight_click', elem);
                e.stopPropagation();
            },
            registerClickAction: function(e) {
                var self = this,
                    elem = self.$(e.currentTarget).attr('class');

                self.sendClickAction('1Index_click', elem);
                e.stopPropagation();
            },
            sendClickAction: function(event, elem) {
                var self = this,
                    eventName = event || '',
                    currentPoll = self.pollsCollection.getCurrentElement(),
                    actionElem = elem || currentPoll.get('relatedUrl');

                if (currentPoll) {
                    Ajax({
                        url: App.config.URL_SERVER_API_NEW + 'event-track',
                        type: 'GET',
                        showLoader: false,
                        data: {
                            sourceType: 'poller',
                            sourceCode: self.widgetCode,
                            poll: currentPoll.get('id'),
                            event: event
                        }
                    });
                }
            },
            cleanCurrentPollState: function() {
                var self = this;

                self.$(self.currentPollElement)
                    .find(self.selector.optionsBlock + ',' + self.selector.shareBlock)
                    .html('')
                    .hide();
            },
            preventClick: function(e) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        return smartView;
    }
);