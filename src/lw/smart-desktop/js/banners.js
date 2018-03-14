define('js/banners',
    [   
        'app',
        'text!common/templates/banners.tpl'
    ],
    function(App, tpl) {

        var adUnitDefaultView = App.View.defaultView.extend({
            responsiveAdPosition: function() {
                var self = this,
                    isEnabledRight = self.parent.adUnitPlacementOnRight.isEnabled, 
                    isEnabledLeft = self.parent.adUnitPlacementOnLeft.isEnabled,
                    $widgetContainer = self.parent.$('.js-widget-container'),
                    minimalWidgetWidth = (self.parent.type === 'smart' || self.parent.type === 'smart3') ? 200 : 250,
                    rightUnitSettings = _.where(self.parent.adUnits, { placement: 'right' })[0],
                    leftUnitSettings = _.where(self.parent.adUnits, { placement: 'left' })[0],
                    widgetSizeParams = self.parent.widgetSizeParams.dynamicWidth = $widgetContainer.width();

                if (self.parent.isResizableWidget) {
                    if (isEnabledLeft) {
                        if (widgetSizeParams <= minimalWidgetWidth) {
                            if (self.parent.adUnitPlacementOnLeft.isBannerRender) widgetSizeParams = widgetSizeParams + leftUnitSettings.width;
                            self.parent.adUnitPlacementOnLeft.isBannerRender = false;
                            self.parent.adUnitPlacementOnLeft.setBannerVisible('hideBanner');
                        }
                        else if ((widgetSizeParams - leftUnitSettings.width) > minimalWidgetWidth && !self.parent.adUnitPlacementOnLeft.isBannerRender) {
                            self.parent.adUnitPlacementOnLeft.isBannerRender = true;
                            widgetSizeParams = widgetSizeParams - leftUnitSettings.width;
                            self.parent.adUnitPlacementOnLeft.setBannerVisible('showBanner');
                        }
                    }
                    if (isEnabledRight) {
                        if (widgetSizeParams <= minimalWidgetWidth) {
                            self.parent.adUnitPlacementOnRight.isBannerRender = false;
                            widgetSizeParams = widgetSizeParams + rightUnitSettings.width;
                            self.parent.adUnitPlacementOnRight.setBannerVisible('hideBanner');
                        }
                        else if ((widgetSizeParams - rightUnitSettings.width) > minimalWidgetWidth && !self.parent.adUnitPlacementOnRight.isBannerRender) {
                            if (self.parent.adUnitPlacementOnRight.isBannerRender) widgetSizeParams = widgetSizeParams - rightUnitSettings.width;
                            self.parent.adUnitPlacementOnRight.isBannerRender = true;
                            self.parent.adUnitPlacementOnRight.setBannerVisible('showBanner');
                        }
                    }
                }
            }
        });

        var bannerInPollRotationDialog = adUnitDefaultView.extend({
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

        var adUnitPlacementOnTop = adUnitDefaultView.extend({
            name: 'adUnitPlacementOnTop',
            dfpResponsiveTpl: 'tplDfpResponsive',
            adSettings: null,
            isBannerRender: false,
            isEnabled: false,
            isVisible: false,
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
                        case 'adUnitPlacementOnLeft':
                        case 'adUnitPlacementOnRight':
                            if (self.parent.isWidgetVisibleOnPage) canRefresh = true;
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
                    self.parent.trackBannerRender(self.parent.widgetCode, self.adSettings.adUnitId);
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

        var adUnitPlacementOnLeft = adUnitPlacementOnTop.extend({
            name: 'adUnitPlacementOnLeft',
            adSettings: null,
            isEnabled: false,
            widgetWidth: null,
            isBannerRender: false,
            onInitialize: function() {
                var self = this;

                self.listenTo(self.parent, 'refreshLeftRightAdunit', function(actionBy) {
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
                var self = this,
                    widgetSizeParams = self.parent.widgetSizeParams,
                    widgetWidth = widgetSizeParams.width ? widgetSizeParams.width : self.parent.width,
                    widgetHeight = widgetSizeParams.height ? widgetSizeParams.height : self.parent.height,
                    newWidgetWidth = widgetWidth === '100%' ? widgetSizeParams.dynamicWidth ? widgetSizeParams.dynamicWidth : self.parent.$el.width() : widgetWidth;

                if ((parseInt(newWidgetWidth) - self.adSettings.width) > self.parent.minWidth) {
                    self.parent.resizeWidgetHeight({
                        width: widgetWidth = widgetWidth === '100%' ? 0 : (parseInt(newWidgetWidth) - self.adSettings.width),
                        height: widgetHeight
                    });

                    self.parent.postMessage('action', {
                        method: 'renderBanner',
                        arguments: [self.parent.token, self.adSettings.id]
                    });

                    self.parent.widgetSizeParams.dynamicWidth = parseInt(newWidgetWidth) - self.adSettings.width;
                    self.parent.trackBannerRender(self.parent.widgetCode, self.adSettings.adUnitId);
                    self.isBannerRender = true;
                }
            }
        });
    
        var adUnitPlacementOnRight = adUnitPlacementOnLeft.extend({
            name: 'adUnitPlacementOnRight',
            isBannerRender: false,
            adSettings: null,
            isEnabled: false
        });
        
        return {
                adUnit: adUnitDefaultView,
                bannerInPollRotationDialog: bannerInPollRotationDialog,
                adUnitPlacementOnTop: adUnitPlacementOnTop,
                adUnitPlacementOnBottom: adUnitPlacementOnBottom,
                adUnitPlacementOnLeft: adUnitPlacementOnLeft,
                adUnitPlacementOnRight: adUnitPlacementOnRight
            };

    }
);