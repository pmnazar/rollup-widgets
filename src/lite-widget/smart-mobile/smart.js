define(
    'smart-mobile/smart',
    [
        'app',
        'default',
        'common/js/modules/sharing',
        'common/js/modules/conversion-dialog',
        'collections/smart-collection',
        'models/smart-multiside-poll-model',
        'helpers/statistic/to-friendly-number',
        'helpers/strings/hex-convert',
        'helpers/images',
        'helpers/auth/social-auth',
        'text!smart-mobile/templates/smart.tpl',
        'helpers/ajax/ajax-wrapper',
        'helpers/settings/is-white-label-holding',
        'libs/touch'
    ],
    function (App,
              initView,
              sharingDialog,
              conversionDialog,
              smartCollection,
              multisidePollModel,
              toFriendlyNubmer,
              hexConvert,
              Img,
              authBySoc,
              tpl,
              Ajax,
              isWhiteLabelHolding) {
        return initView.extend({
            $pollContainer: $(),
            $actionViewPortContainer: $(),
            isEmbedCodeShown: false,
            isEmptyPoll: false,
            isRender: false,
            isWhiteLabel: false,
            isFirstPollViewed: false,
            settedFontSize: null,
            responsiveTaglineContainerWidth: null,
            showSocialButton: false,
            hiddenAnswers: [],
            asyncFetch: null,
            requestNewPolls: true,
            excludedPolls: [],
            pollContainerSelector: '#pollContent',
            pollAnswerContainer: '#poll-info-view-port',
            selector: {
                actionsForVotedPoll: '.js-sharing-dialog',
                taglineContainer: '.js-tagline-container',
                taglineElement: '.js-tagline-element'
            },
            tplMain: 'tplWidgetBase',
            tplPollContainer: 'tplWidgetPollContainer',
            tplVotingPanel: 'tplWidgetVotingPanel',
            tplActionsForVotedPoll: 'tplActionsForVotedPoll',
            tplWidgetEmbedCode: 'tplWidgetEmbedCode',
            events: {
                'tap #showNextPoll': 'nextPollInRotation',
                'tap #showPrevPoll': 'prevPollInRotation',
                'change .js-poll-vote': 'vote',
                'tap .js-show-all-answers': 'expandVotingPanel',
                'tap .js-hide-all-answers': 'shrinkVotingPanel',
                'tap .js-show-sharing-dialog-btn': 'showSharingDialog',
                'tap .js-close-sharing-dialog-btn': 'hideSharingDialog',
                'tap .js-one-index': 'registerClickAction',
                'tap .js-learn-more': 'registerClickOnLearnMore',
                'tap .js-fb-share-btn': 'fbShare',
                'tap .js-g-plusone-share-btn': 'gPlusOneShare',
                'tap .js-twitter-share-btn': 'twitterShare',
                'tap .js-linked-in-share-btn': 'linkedInShare',
                'tap .js-weibo-share-btn': 'weiboShare',
                'tap .js-vk-share-btn': 'vkShare',
                'tap .js-show-embed-code-dialog': 'showEmbedCodeDialog',
                'tap .js-close-embed-code-dialog': 'closeEmbedCodeDialog'
            },
            onInitialize: function() {
                var self = this;

                self.childs = {};
                self.templatesObject = self.prepareTpl(tpl);
                self.getPolls(function() {

                    if (0 === self.width) {
                        self.width = $(window).width();
                        self.isResizableWidget = true;
                    }

                    self.isEmptyPoll = false;
                    self.startTrackView();
                    self.render();
                    self.initializeCollectionEvents();
                    self.trackWidgetLoading();
                });

                if (self.enableConversionWindow) self.childs.conversionDialog = new conversionDialog({ parent: self });
                self.childs.sharingDialog = new sharingDialog({ parent: self });

                authBySoc.checkAuth();
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
            onWindowResize: function() {
                var self = this;

                if (!self.isEmptyPoll) {
                    if (self.isResizableWidget) {
                        self.width = $(window).width();
                    }

                    if (self.isRender) {
                        self.setResponsiveHeaderText();
                        self.setResponsiveTagLine();
                        Img.resizeImages();
                    }
                }
            },
            render: function() {
                var self = this,
                    poll = self.pollsCollection.getCurrentElement(),
                    partner = self.partner;

                self.showSocialButton =
                    self.showFBLike ||
                    self.showTwitterLike ||
                    self.showGooglePlusLike ||
                    self.showLinkedInLike ||
                    self.showWeiboSharing ||
                    self.showVkontakteSharing;

                if (self.isEmptyPoll) {
                    if (0 === self.width) {
                        self.width = $(window).width();
                        self.isResizableWidget = true;
                    }
                }

                self.isWhiteLabel = isWhiteLabelHolding(partner);

                if (self.isWhiteLabel) {
                    self.partnerName = partner.parentObject ? partner.parentObject.name : partner.name;
                }

                if (!self.isRender) {
                    self.$el.html(self.getTemplate(self.tplMain, self.templatesObject, {
                        poll: poll,
                        isEmpty: self.isEmptyPoll,
                        partnerName: self.partnerName,
                        hexConvert: hexConvert,
                        showHeaderLogo: self.showHeaderLogo,
                        headerTextColor: self.headerTextColor,
                        headerTextAlignment: self.headerTextAlignment,
                        headerLogo: self.headerLogo,
                        headerLogoUrl: self.headerLogoRedirectUrl,
                        headerTitleState: self.headerTitleState,
                        showHeader: self.showHeader,
                        headerTitle: self.headerTitle,
                        headerBarColor: self.headerBarColor,
                        pollTaglineTextColor: self.pollTaglineTextColor,
                        showFooter: self.showFooter,
                        showFooterLogoAndText: self.showFooterLogoAndText,
                        partner: self.partner,
                        backgroundColor: self.backgroundColor,
                        backgroundTransparency: self.backgroundTransparency,
                        showEmbedCodeBtn: self.showEmbedCodeBtn,
                        showSocialButton: self.showSocialButton,
                        embedCodeHtml: self.embedCodeHtml,
                        config: App.config,
                        isWhiteLabel: self.isWhiteLabel,
                        frontStatic: App.config.DEBUG_MODE ? App.config.FRONT_STATIC_DEBUG_WIDGET : App.config.FRONT_STATIC
                    }));

                    self.isRender = true;
                }

                if (!self.isEmptyPoll) {
                    self.showPoll();
                    self.showVotingPanel();
                }
                else {
                    self.showEmptyPoll();
                }
            },
            showEmptyPoll: function() {
                var self = this;

                self.$pollContainer = self.$(self.pollContainerSelector);
                self.$pollContainer.html(self.getTemplate(self.tplPollContainer, self.templatesObject, {
                    isEmptyPoll: self.isEmptyPoll,
                    hexConvert: hexConvert
                }));
            },
            showPoll: function() {
                var self = this,
                    poll = self.pollsCollection.getCurrentElement();

                self.settedFontSize = null;
                self.responsiveTaglineContainerWidth = null;
                self.$pollContainer = self.$(self.pollContainerSelector);
                self.$pollContainer.html(self.getTemplate(self.tplPollContainer, self.templatesObject, {
                    poll: poll,
                    widgetCode: self.widgetCode,
                    locale: self.displayLocale,
                    showLearnMore: self.showLearnMore,
                    toFriendlyNubmer: toFriendlyNubmer,
                    pollTaglineTextColor: self.pollTaglineTextColor,
                    pollTaglineAlignment: self.pollTaglineAlignment,
                    pollsNumber: self.pollsCollection.length,
                    votingButtonsColor: self.votingButtonsColor,
                    pollRotationArrowsColor: self.pollRotationArrowsColor,
                    isEmptyPoll: self.isEmptyPoll,
                    showSocialButton: self.showSocialButton,
                    headerTitleState: self.headerTitleState,
                    showHeader: self.showHeader
                }));

                self.$actionViewPortContainer = self.$(self.pollAnswerContainer);
                self.setResponsiveHeaderText();
                self.setResponsiveTagLine();

                if (self.isFirstPollViewed) {
                    self.trackPollViews(poll);
                }
            },
            setResponsiveHeaderText: function() {
                var self = this,
                    $headerContainer = self.$('.js-responsive-title');

                $headerContainer.css('max-width', self.$(self.pollContainerSelector).width() - 10);
            },
            setResponsiveTagLine: function() {
                var self = this,
                    taglineWrapperHeight = 50,
                    fontStep = 1,
                    $tagLineElem = self.$el.find(self.selector.taglineContainer),
                    startFontSize = $tagLineElem.offsetWidth < 400 ? 24 : 28,
                    $pollContainer = self.$(self.pollContainerSelector);

                function setNewFontSize() {
                    var $taglineTextWidth = self.$(self.selector.taglineElement).width();
                        self.settedFontSize = $tagLineElem.css('font-size').replace(/[^-\d\.]/g, '');

                    if (_.isNull(self.responsiveTaglineContainerWidth)) self.responsiveTaglineContainerWidth = 0;
                    if ($tagLineElem.height() > taglineWrapperHeight || $tagLineElem.parent().offsetHeight > taglineWrapperHeight ||
                        $taglineTextWidth > ($pollContainer.width() - 22))
                    {
                        $tagLineElem.css('font-size',(($tagLineElem.css('font-size').substr(0, 2) - fontStep)) + 'px')
                                    .css('line-height',(($tagLineElem.css('font-size').substr(0, 2))) + 'px');

                        self.settedFontSize = $tagLineElem.css('font-size').replace(/[^-\d\.]/g, '');
                        self.responsiveTaglineContainerWidth = $pollContainer.width();

                        setNewFontSize();
                    }
                    else if (self.settedFontSize < startFontSize &&
                            self.responsiveTaglineContainerWidth < $pollContainer.width())
                    {
                        $tagLineElem.css('font-size', (++self.settedFontSize) + 'px').css('line-height',(($tagLineElem.css('font-size').substr(0, 2))) + 'px');
                        if (self.settedFontSize <= startFontSize) setNewFontSize();
                    }
                }

                setNewFontSize();
            },
            showSharingDialog: function() {
                var self = this,
                    poll = self.pollsCollection.getCurrentElement();

                if (poll) {
                    self.$(self.selector.actionsForVotedPoll).html(self.getTemplate(self.tplActionsForVotedPoll, self.templatesObject, {
                        showFBLike: self.showFBLike,
                        showTwitterLike: self.showTwitterLike,
                        showGooglePlusLike: self.showGooglePlusLike,
                        showLinkedInLike: self.showLinkedInLike,
                        showWeiboSharing: self.showWeiboSharing,
                        showVkontakteSharing: self.showVkontakteSharing
                    })).show();
                }
            },
            hideSharingDialog: function(e) {
                var self = this;

                e.stopPropagation();
                e.preventDefault();
                self.$(self.selector.actionsForVotedPoll).html('').hide();
            },
            showVotingPanel: function() {
                var self = this,
                    $answerAction = self.$('.js-answer-action'),
                    currentPoll = self.pollsCollection.getCurrentElement(),
                    currentPollSides = currentPoll ? currentPoll.get('sides') : [],
                    answersHeight = 0,
                    answerMargin = 0, //bottom margin option for unexpected mockup changes
                    pollAnswerContainer = 139;

                self.hiddenAnswers = [];
                self.$actionViewPortContainer.html(self.getTemplate(self.tplVotingPanel, self.templatesObject,{
                    poll: currentPoll,
                    hexConvert: hexConvert,
                    sides: currentPollSides,
                    votingButtonsColor: self.votingButtonsColor,
                    pollTaglineTextColor: self.pollTaglineTextColor,
                    backgroundColor: self.backgroundColor,
                    backgroundTransparency: self.backgroundTransparency
                }));

                _.each(self.$el.find('.js-poll-answer'), function(element) {
                    answersHeight = answersHeight + 40;
                    if (answersHeight > pollAnswerContainer) {
                        self.hiddenAnswers.push(element);
                        $(element).hide();
                    }
                });

                if (pollAnswerContainer < answersHeight) {
                    $answerAction.show();
                }
                else {
                    $answerAction.hide();
                }

                if (self.isVotingPanelExpend) {
                    self.expandVotingPanel();
                }

                Img.resizeImages();
            },
            shrinkVotingPanel: function(e) {
                var self = this,
                    $answerContainer = self.$('.js-answer-container'),
                    $expandButton = self.$('.js-answer-action');

                if (e) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                $answerContainer.removeClass('expanded');
                $expandButton.removeClass('collapser');
                _.each(self.hiddenAnswers, function(element) { $(element).hide(); });
                self.isVotingPanelExpend = false;
            },
            expandVotingPanel: function(e) {
                var self = this,
                    $answerContainer = self.$('.js-answer-container'),
                    $expandButton = self.$('.js-answer-action');

                if (e) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                $answerContainer.addClass('expanded');
                $expandButton.addClass('collapser');
                self.$el.find('.js-poll-answer').show();
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

                if (self.adInitialized) {
                    self.adUnitInPollRotationDialog.showNextPoll();
                    self.trigger('refreshTopBottomJsAdUnit', 'userPrevNextAction');
                    self.trigger('refreshLeftRightAdunit', 'userPrevNextAction');
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

                if (self.adInitialized) {
                    self.trigger('refreshTopBottomJsAdUnit', 'userPrevNextAction');
                    self.trigger('refreshLeftRightAdunit', 'userPrevNextAction');
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
                    });
                }

                return self;
            },
            votingCallback: function(view) {
                var self = view,
                    $answerContainer = self.$('.js-answer-container');

                self.isVotingPanelExpend = !!$answerContainer.hasClass('expanded');

                self.showPoll();
                self.showVotingPanel();
                self.incrementWidgetVotesCounter();

                if ('conversionDialog' in self.childs) {
                    self.childs.conversionDialog.newVote();
                }

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
                        pageSize: self.pollsCount,
                        excluded: self.excludedPolls.toString(),
                        location: self.partnerPageUrl
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
            showEmbedCodeDialog: function(e) {
                var self = this,
                    $currentTarget = self.$(e.currentTarget);

                if (!self.isEmbedCodeShown) {
                    self.$('#jsEmbedCode').html(_.escape(self.getTemplate(self.tplWidgetEmbedCode, self.templatesObject, {
                        widget: {
                            widgetCode: self.widgetCode,
                            mode: self.mode
                        }
                    })));
                    $currentTarget.children().show();
                    self.isEmbedCodeShown = true;
                }
            },
            closeEmbedCodeDialog: function(e) {
                var self = this,
                    $currentTarget = self.$(e.currentTarget);

                self.isEmbedCodeShown = false;
                $currentTarget.parent().hide();
            }
        });
    }
);