define('js/banners',
    [   
        'app',
        'text!common/templates/banners.tpl'
    ],
    function(App, tpl) {

        var bannerInPollRotationDialog = App.View.defaultView.extend({
            name: 'bannerInPollRotationDialog',
            adSettings: null,
            isEnabled: false,
            isDisplayStepChanged: false,
            initializeBannerSettings: function(settings) {
                var self = this;    
                    self.adSettings = settings;

                self.isEnabled = true;
            },
            render: function() {
                var self = this;

                self.parent.postMessage('action', {
                    method: 'renderBanner',
                    arguments: [self.parent.token, self.adSettings.id]
                });

                self.parent.isVotingPanelActive = false;
                self.parent.trackBannerRender(self.parent.widgetCode, self.adSettings.adUnitId);
            },
            processVoting: function() {
                var self = this,
                    displayAt,
                    votesCounter;
 
                if (self.isEnabled) {
                    if (self.isDisplayStepChanged) {
                        displayAt = self.adSettings.displayAtSubsequence;
                        votesCounter = self.adSettings.votesCountTriggerSubsequence;    
                    }
                    else {
                        displayAt = self.adSettings.displayAt;
                        votesCounter = self.adSettings.votesCountTrigger;
                    }
                }

                if (self.parent.adUnitDisplay && self.isEnabled && 'after_voting' === displayAt && self.parent.adUnitVotesCounter && self.parent.adUnitVotesCounter > 0 &&
                    0 === (self.parent.adUnitVotesCounter % votesCounter)) {
                        self.displayBanner();
                        self.parent.adUnitVotesCounter = 0;
                        self.parent.saveVotesCounterInCache();

                    if (self.adSettings.votesCountTriggerSubsequence > 0 && !self.isDisplayStepChanged) {
                        self.isDisplayStepChanged = true;
                    }
                }
            },
            showNextPoll: function() {
                var self = this,
                    displayAt,
                    votesCounter;

                if (self.isEnabled) {
                    if (self.isDisplayStepChanged) {
                        displayAt = self.adSettings.displayAtSubsequence;
                        votesCounter = self.adSettings.votesCountTriggerSubsequence;
                    }
                    else {
                        displayAt = self.adSettings.displayAt;
                        votesCounter = self.adSettings.votesCountTrigger;
                    }
                }

                if (self.parent.adUnitDisplay && self.isEnabled && self.parent.adUnitVotesCounter && self.parent.adUnitVotesCounter > 0 &&
                    'after_clicking_next' === displayAt && 0 === (self.parent.adUnitVotesCounter % votesCounter)) {
                        self.displayBanner();
                        self.parent.adUnitVotesCounter = 0;
                        self.parent.saveVotesCounterInCache();

                    if (self.adSettings.votesCountTriggerSubsequence > 0 && !self.isDisplayStepChanged) {
                        self.isDisplayStepChanged = true;
                    }                                            
                }
            },
            displayBanner: function() {
                var self = this;

                self.render();
            }
        });

        var adUnitPlacementOnTop = App.View.defaultView.extend({
            name: 'adUnitPlacementOnTop',
            dfpResponsiveTpl: 'tplDfpResponsive',
            adSettings: null,
            widgetSizeParams: {
                width: null,
                height: null
            },
            isBannerRender: false,
            isEnabled: false,
            isVisible: false,
            isResized: false,
            onInitialize: function() {
                var self = this;

                self.listenTo(self.parent, 'refreshTopBottomJsAdUnit', function(actionBy) {
                    var action = actionBy ? actionBy : null;
                    self.refreshAd(action);
                });
            },
            initializeBannerSettings: function(settings, token) {
                var self = this;    
                    self.adSettings = settings;

                self.isEnabled = true;
                self.render();
            },
            render: function() {
                var self = this;
                
                if (self.adSettings.network !== 'dfpResponsive') {
                    if (!self.isResized) {
                        self.parent.resizeWidgetHeight({
                            width: self.parent.width,
                            height: self.adSettings.height <= 50 ? self.parent.minHeight - 50 : self.parent.minHeight
                        });
                        
                        self.isResized = true;
                    }
                    
                    self.parent.postMessage('action', {
                        method: 'renderBanner',
                        arguments: [self.parent.token, self.adSettings.id]
                    });
                }

                if ((self.adSettings.network === 'dfpResponsive')) {
                    var dfpSize = JSON.parse(self.adSettings.size),
                        actualWidgetWidth = self.parent.$el.width(),
                        optimalSize = [],
                        bannerJS,
                        sizeSelection,
                        preparedTpl;

                    sizeSelection = dfpSize.reduce(function(prev, current) {
                        var size;
                        if (actualWidgetWidth >= current.split('*')[0] && prev.split('*')[0] == current.split('*')[0]) {
                            size = current;
                            optimalSize.push(current.replace('*',','));
                        }
                        else if (actualWidgetWidth >= current.split('*')[0] && prev.split('*')[0] <= current.split('*')[0]) {
                            optimalSize = [];
                            optimalSize.push(current.replace('*',','));
                            size = current;
                        }

                        return size;
                    });

                    preparedTpl = self.prepareTpl(tpl);
                    bannerJS = self.getTemplate(self.dfpResponsiveTpl, preparedTpl, {
                        responsiveSize: optimalSize,
                        dfpCode: self.adSettings.dfpCode,
                        id: self.adSettings.id,
                        widgetCodeToken: self.parent.token,
                        bannerType: self.name
                    });

                    self.parent.postMessage('action', {
                        method: 'pushBannerProp',
                        arguments: [self.parent.token, self.adSettings, {
                            jsCode: bannerJS,
                            width: actualWidgetWidth
                        }]
                    });

                    self.parent.postMessage('action', {
                        method: 'renderBanner',
                        arguments: [self.parent.token, self.adSettings.id]
                    });
                }
                
                self.parent.trackBannerRender(self.parent.widgetCode, self.adSettings.adUnitId);
                self.isBannerRender = true;
            },
            refreshAd: function(action) {
                var self = this;
                
                function bannerTypeRules(name) {
                    var canRefresh = false;

                    switch (name) {
                        case 'adUnitPlacementOnTop':
                        case 'adUnitPlacementOnBottom':
                            if (self.isVisible) canRefresh = true;
                            break;
                    }

                    return canRefresh;
                }

                function runRefresh() {
                    if (bannerTypeRules(self.name)) {
                        self.parent.postMessage('action', {
                            method: 'bannerEvents',
                            arguments: [self.parent.token, self.adSettings.id, 'refreshBanner']
                        });
                        self.parent.trackBannerRender(self.parent.widgetCode, self.adSettings.adUnitId);
                    }
                }

                if (self.adSettings && self.isBannerRender && self.parent.isPartnerPageActive) {
                    if ((action === 'userNextAction' || action === 'userVoteAction') && self.adSettings.refreshAfterEachResponse) {
                        runRefresh();
                    }

                    if ((action === 'userPrevNextAction') && self.adSettings.refreshAfterEachPrevNext) {
                        runRefresh();
                    }

                    if (action === 'userCallAction') {
                        runRefresh();
                    }

                    if (action === 'quizRetake' && self.adSettings.refreshAfterEachRetake) {
                        runRefresh();
                    }
                }
            },
            setBannerVisible: function(event) {
                var self = this;

                self.parent.postMessage('action', {
                    method: 'bannerEvents',
                    arguments: [self.parent.token, self.adSettings.id, event]
                });

                if (event !== 'hideBanner') {
                    self.parent.trackBannerRender(self.widgetCode, self.adSettings.adUnitId);
                }
            }
        });

        var adUnitPlacementOnBottom = adUnitPlacementOnTop.extend({
            name: 'adUnitPlacementOnBottom',
            isBannerRender: false,
            adSettings: null,
            isEnabled: false,
            isVisible: false
        });
        
        return {
                bannerInPollRotationDialog: bannerInPollRotationDialog,
                adUnitPlacementOnTop: adUnitPlacementOnTop,
                adUnitPlacementOnBottom: adUnitPlacementOnBottom
            };

    });