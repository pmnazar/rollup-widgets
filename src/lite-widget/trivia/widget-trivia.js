define(
    'smart/smart-mobile',
    [
        'app',
        'default',
        'common/js/modules/sharing',
        'collections/trivia-collection',
        'models/smart-multiside-poll-model',
        'helpers/images',
        'helpers/settings/is-white-label-holding',
        'text!trivia/templates/trivia.tpl'
    ],
    function (App, initView, sharingDialog, triviaSidesCollection, multisidePollModel, Img, isWhiteLabelHolding, tpl) {
        var triviaView = initView.extend({
            templates: {
                tplMain: 'tplWidgetBase',
                tplLeftSideBox: 'tplLeftSideBox',
                tplRightSideBox: 'tplRightSideBox',
                tplCorrectAnswer: 'tplCorrectAnswer',
                tplWrongAnswer: 'tplWrongAnswer',
                tplResultOverlay: 'tplResultOverlay',
                tplShareDialog: 'tplShareDialog',
                tplFinalScreen: 'tplFinalScreen',
                tplMoreDetails: 'tplMoreDetails'
            },
            selectors: {
                mainContainer: '.js-flex',
                leftSideBox: '.js-left-side-box',
                rightSideBox: '.js-right-side-box',
                answerArea: '.js-answers-area',
                correctAnswerOverlay: '.js-correct-answer',
                wrongAnswerOverlay: '.js-wrong-answer',
                scoreCorrectAnswer: '#score-correct-answ',
                scoreTotalAnswer: '#score-total-answ',
                moreDetailsOverlay: '.js-more-details',
                closeMoreDetails: '.js-close-details',
                sharingDialog: '.js-sharing-dialog',
                closeSharingDialog: '.js-close-sharing-dialog',
                showMore: '.js-show-more',
                hideMore: '.js-hide-more',
                skipPoll: '.js-skip-poll',
                finalScreen: '.js-final-screen',
                linkMoreTrivia: '.js-link-related-tag',
                relatedHeader: '.js-related-header'
            },
            currentPoll: null,
            enabledFinalScreen: null,
            enabledAdditionalInfo: null,
            isRelatedTag: false,
            tagId: 0,
            childs: {},
            userScore: {
                correct: 0,
                total: 0
            },
            firstPollImg: '',
            skippedPollIds: [],
            isWhiteLabel: false,
            events: {
                'click .js-poll-vote': 'vote',
                'click .js-next-poll': 'nextPoll',
                'click .js-skip-poll': 'skipPoll',
                'click .js-show-sharing-dialog-btn': 'showSharingDialog',
                'click .js-close-sharing-dialog': 'closeSharingDialog',
                'click .js-show-more': 'readMore',
                'click .js-hide-more': 'readMore',
                'click .js-show-more-details': 'showMoreDetails',
                'click .js-close-details': 'closeMoreDetails',
                'click .js-fb-share-btn': 'fbShare',
                'click .js-g-plusone-share-btn': 'gPlusOneShare',
                'click .js-twitter-share-btn': 'twitterShare',
                'click .js-vk-share-btn': 'vkShare',
                'click .js-poll-vote-move': 'onPollVoteMove',
                'click .js-link-related-tag': 'onRelatedTag'
            },
            onInitialize: function() {
                var self = this,
                    partner = self.partner;

                self.templatesObject = self.prepareTpl(tpl);
                self.getPollsByTag(function() {
                    self.currentPoll = self.pollsCollection.getCurrentElement();
                    self.firstPollImg = self.currentPoll ? self.currentPoll.get('icon') : '';
                    self.enabledFinalScreen = self.pollsCollection.length > 0;
                    self.renderMain();
                    self.initializeLeftSideBox();
                    self.initializeRightSideBox();
                    self.trackWidgetLoading();
                }, self.isRelatedTag, self.tagId);

                if (_.isEmpty(self.childs.sharingDialog)) {
                    self.childs.sharingDialog = new sharingDialog({parent: self});
                }

                self.isWhiteLabel = isWhiteLabelHolding(partner);
            },
            onWindowResize: function() {
                var self = this,
                    $mainConainer = self.$(self.selectors.mainContainer),
                    documentWidth = document.body.clientWidth;

                if (documentWidth >= 600) {
                    $mainConainer.show();
                    $mainConainer.removeClass('column');
                    self.resizeWidgetHeight({ width: 0, height: 250 });
                }
                else if (documentWidth <= 599 && documentWidth > 299) {
                    $mainConainer.show();
                    $mainConainer.addClass('column');
                    self.resizeWidgetHeight({ width: 300, height: 600 });
                }
                else {
                    $mainConainer.hide();
                }
            },
            renderMain: function() {
                var self = this;

                self.$el.html(self.getTemplate(self.templates.tplMain, self.templatesObject, {
                    backgroundColor: self.backgroundColor,
                    colorTheme: self.colorTheme
                }));
                
                self.onWindowResize();
            },
            initializeLeftSideBox: function() {
                var self = this,
                    $sideBox = self.$(self.selectors.leftSideBox);

                if (!$sideBox.is(':visible')) $sideBox.show();

                if (self.pollsCollection.length) self.sideBoxEventListener();
                self.showQuestion();
            },
            showQuestion: function() {
                var self = this,
                    backgroundImage = self.currentPoll && self.currentPoll.get('icon');

                self.$(self.selectors.leftSideBox).html(self.getTemplate(self.templates.tplLeftSideBox, self.templatesObject, {
                    poll: self.currentPoll,
                    headerText: self.name || '',
                    isSkipedPolls: !!self.skippedPollIds.length,
                    backgroundImage: typeof backgroundImage === 'string' ? backgroundImage : false
                }));
                Img.resizeImages();
            },
            sideBoxEventListener: function() {
                var self = this,
                    poll = self.pollsCollection.getCurrentElement(),
                    sideModels,
                    selectedSide;

                poll.on("change:votedForSide", function(model, name) {
                    if(!model.get('votedForSide')) return false;

                    sideModels = model.get('sides').models;
                    selectedSide = _.findWhere(sideModels, { 'id': name });

                    self.enabledAdditionalInfo = !!(model.get('correctAnswerDataPoint') || selectedSide.get('additionalInfo'));

                    if (selectedSide.get('id') === model.get('correctAnswer')) {
                        self.correctAnswer(selectedSide);
                    }
                    else {
                        self.wrongAnswer(sideModels, selectedSide);  
                    }

                    self.userScore.total += 1;
                    self.$(self.selectors.scoreTotalAnswer).html(self.userScore.total);
                });
            },
            correctAnswer: function(selectedSide) {
                var self = this;
                
                self.userScore.correct += 1;
                self.$(self.selectors.correctAnswerOverlay).html(self.getTemplate(self.templates.tplCorrectAnswer, self.templatesObject, {
                    question: self.currentPoll.get('tagLine'),
                    answer: selectedSide.get('answer'),
                    sideId: selectedSide.get('id'),
                    userScore: self.userScore,
                    additionalInfo: self.enabledAdditionalInfo
                })).show();

                self.$(self.selectors.scoreCorrectAnswer).html(self.userScore.correct);
            },
            wrongAnswer: function(sides, selectedSide) {
                var self = this,
                    correctAnswer;

                correctAnswer = _.find(sides, function(attr) {
                    return attr.get('id') === self.currentPoll.get('correctAnswer'); 
                });

                self.$(self.selectors.wrongAnswerOverlay).html(self.getTemplate(self.templates.tplWrongAnswer, self.templatesObject, {
                    question: self.currentPoll.get('tagLine'),
                    wrongAnswer: selectedSide.get('answer'),
                    sideId: selectedSide.get('id'),
                    correctAnswer: correctAnswer.get('answer'),
                    additionalInfo: self.enabledAdditionalInfo
                })).show();
            },
            initializeRightSideBox: function() {
                var self = this;

                self.showAnswers();
            },
            showAnswers: function() {
                var self = this,
                    backgroundImage = self.currentPoll && self.currentPoll.get('icon');

                self.$(self.selectors.rightSideBox).html(self.getTemplate(self.templates.tplRightSideBox, self.templatesObject, {
                    poll: self.currentPoll,
                    backgroundImage: backgroundImage ? backgroundImage + '-400x300' : false,
                    userScore: self.userScore,
                    pollTaglineTextColor: self.pollTaglineTextColor,
                    votingButtonsColor: self.votingButtonsColor,
                    isWhiteLabel: self.isWhiteLabel,
                    config: App.config,
                    frontStatic: App.config.DEBUG_MODE ? App.config.FRONT_STATIC_DEBUG_WIDGET : App.config.FRONT_STATIC
                }));

                if (!self.currentPoll) {
                    self.findRelatedLink();
                }
            },
            showMoreDetails: function(e) {
                var self = this,
                    additionalInfo,
                    datapoint = self.currentPoll.get('correctAnswerDataPoint'),
                    sideId = self.$(e.target).data('side-id');

                additionalInfo = _.findWhere(self.currentPoll.get('sides').models, { id: sideId });

                self.$(self.selectors.moreDetailsOverlay).html(self.getTemplate(self.templates.tplMoreDetails, self.templatesObject, {
                    pollTagline: self.currentPoll.get('tagLine'),
                    datapointValue: datapoint,
                    additionalInfoValue: additionalInfo
                })).show();
                self.onWindowResize();
            },
            closeMoreDetails: function() {
                var self = this;

                self.$(self.selectors.moreDetailsOverlay).html('');
            },
            nextPoll: function() {
                var self = this,
                    currentIndex = self.pollsCollection.currentElementIndex,
                    lastIndex = _.lastIndexOf(self.pollsCollection);

                if (currentIndex === lastIndex) {
                    self.pollsCollection.fetch({
                        url: App.config.URL_SERVER + 'TagFindNonVotedPollsByTags',
                        showLoader: true,
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json',
                        data: JSON.stringify({
                            widgetCode: self.widgetCode,
                            locale: self.displayLocale,
                            skippedPollIds: self.skippedPollIds,
                            limit: 3
                        }),
                        callback: function() {
                            if (self.pollsCollection.next() || (!self.pollsCollection.next() && !self.userScore.total)) {
                                if (self.adInitialized && self.adUnitInPollRotationDialog.isEnabled) {
                                    self.adUnitInPollRotationDialog.showNextPoll();
                                }
                                self.currentPoll = self.pollsCollection.getCurrentElement();
                                self.initializeLeftSideBox();
                                self.initializeRightSideBox();
                            }
                            else if (!self.pollsCollection.next() && self.enabledFinalScreen) {
                                if (self.adInitialized && self.adUnitInPollRotationDialog.isEnabled) {
                                    self.adUnitInPollRotationDialog.showNextPoll();
                                }
                                self.showFinalScreen();
                            }
                        }
                    });  
                }
                else {
                    if (self.adInitialized && self.adUnitInPollRotationDialog.isEnabled) {
                        self.adUnitInPollRotationDialog.showNextPoll();
                    }
                    self.currentPoll = self.pollsCollection.next();
                    self.initializeLeftSideBox();
                    self.initializeRightSideBox();
                }
                self.isVotingProcessRun = false;
            },
            showFinalScreen: function() {
                var self = this;

                self.$(self.selectors.finalScreen).html(self.getTemplate(self.templates.tplFinalScreen, self.templatesObject, {
                    headerText: self.name || '',
                    score: self.userScore,
                    img: self.firstPollImg,
                    isWhiteLabel: self.isWhiteLabel,
                    config: App.config,
                    isSkipedPolls: !!self.skippedPollIds.length,
                    frontStatic: App.config.DEBUG_MODE ? App.config.FRONT_STATIC_DEBUG_WIDGET : App.config.FRONT_STATIC
                })).show();

                self.findRelatedLink();
                self.onWindowResize();
            },
            skipPoll: function() {
                var self = this;

                if (self.skippedPollIds.indexOf(self.currentPoll.get('id')) === -1) {
                    self.skippedPollIds.push(self.currentPoll.get('id'));
                }
                self.nextPoll();
            },
            readMore: function() {
                var self = this,
                    $sideBox = self.$(self.selectors.leftSideBox),
                    $showMore = self.$(self.selectors.showMore),
                    $hideMore = self.$(self.selectors.hideMore),
                    $footer = self.$('footer'),
                    selectorArray = [$sideBox, $showMore, $hideMore, $footer];

                for (var i = 0; i < selectorArray.length; i++) {
                    if (selectorArray[i].is(':visible')) {
                        selectorArray[i].hide();
                    }
                    else {
                        selectorArray[i].show();
                    }
                }
            },
            showSharingDialog: function() {
                var self = this;
                
                self.$(self.selectors.skipPoll).addClass('disabled');
                self.$(self.selectors.sharingDialog).html(self.getTemplate(self.templates.tplShareDialog, self.templatesObject, {
                    score: self.userScore,
                    isWhiteLabel: self.isWhiteLabel,
                    config: App.config,
                    frontStatic: App.config.DEBUG_MODE ? App.config.FRONT_STATIC_DEBUG_WIDGET : App.config.FRONT_STATIC
                }));

                self.onWindowResize();
            },
            closeSharingDialog: function() {
                var self = this;

                !self.isVotingProcessRun && self.$(self.selectors.skipPoll).removeClass('disabled');
                self.$(self.selectors.sharingDialog).html('');
            },
            createPollsCollection: function(polls) {
                var self = this,
                    pollsCollection;

                pollsCollection = triviaSidesCollection.extend({
                    'model': multisidePollModel
                });

                return new pollsCollection(polls);
            },
            vote: function(e) {
                var self = this,
                    element = $(e.currentTarget),
                    poll = self.pollsCollection.getCurrentElement();

                e.stopImmediatePropagation();
                self.$(self.selectors.skipPoll).addClass('disabled');
                self.isVotingProcessRun = true;
                self.voteForSide(element.data('pollSideId'), element.data('voteToken'));
                self.incrementWidgetVotesCounter();

                if (self.adInitialized) {
                    self.trigger('refreshTopBottomJsAdUnit', 'userVoteAction');

                    if (self.adUnitInPollRotationDialog.isEnabled) {
                        self.adUnitInPollRotationDialog.processVoting();
                    }
                }
            },
            updateWidget: function() {
                var self = this;

                self.skippedPollIds = [];
                self.userScore = {correct: 0, total: 0};

                self.onInitialize();
            },
            onPollVoteMove: function() {
                var self = this;

                self.pollVoteMove(self.updateWidget);
            },
            onRelatedTag: function(e) {
                var self = this,
                    tagId = $(e.currentTarget).data('id');

                self.isRelatedTag = true;
                self.tagId = tagId;

                self.updateWidget();
                self.isRelatedTag = false;
            },
            setRelatedLink: function(name, id) {
                var self = this,
                    $linkEl = self.$(self.selectors.linkMoreTrivia),
                    $headerEl = self.$(self.selectors.relatedHeader);

                $headerEl.show();
                $linkEl.show();

                $linkEl.text(name);
                $linkEl.attr('data-id', id);
            },
            findRelatedLink: function() {
                var self = this;

                self.getRelatedTag(self.setRelatedLink);
            }
        });

        return triviaView;
    }
);
