define(
    'insight-main',
    [
        'app',
        'default',
        'insight-ad-unit-section',
        'insight-comments-section',
        'insight-related-and-social-section',
        'insight-sharing-sections',
        'insight-poll-info-section',
        'insight-lead-data-point-section',
        'insight-map-sections',
        'insight-poll-stats-section',
        'insight-compare-contrast-section',
        'helpers/maps/load-g-visualizations-lib',
        'helpers/settings/widget-types',
        'helpers/mini-loader',
        'helpers/settings/is-white-label-holding',
        'text!insight-desktop/templates/insights.tpl',
        'text!insight-desktop/templates/maps.tpl'
    ],
    function (
        App,
        DefaultView,
        InsightAdUnitSection,
        InsightCommentSection,
        InsightRelatedAndSocialSection,
        InsightSharingSections,
        InsightPollInfoSection,
        ILDPSection,
        InsightMapSection,
        InsightPollStatsSection,
        InsightCompareAndContrast,
        GoogleChartLibLoader,
        InsightsConf,
        MiniLoader,
        isWhiteLabelHolding,
        mainTpl,
        mapsTpl
        ) {
        var viewCreated = false,
            insightMainView = DefaultView.extend({
            el: '#body',
            trackerName: 'insight',
            insightDefaultSectionColor: InsightsConf.insightDefaultSectionColor,
            insightDefaultHeaderBackgroundColor: InsightsConf.insightDefaultHeaderBackgroundColor,
            insightLangConf: App.config.i18n_PROPERTIES,
            sectionLoadPriorities: InsightsConf.sectionLoadPriorities,
            whiteLabelHoldingOrMember: false,
            defaultSection: {
                displaySectionVotingMap: true,
                displaySectionPollStats: true,
                displaySectionCompareAndContrast: false,
                displaySectionLeadDataPoint: true,
                displaySectionComments: true,
                displaySectionRelatedAndSocial: false
            },
            insightEntity: {},
            GeoChart: {},
            poll: {},
            pollPrevNext: {},
            templatesObject: {},
            templates: {
                insightContainer: 'tplInsightContainer',
                insightInnerLinks: 'tplInsightInnerLinks',
                logoSection: 'tplPartnerLogoSection',
                insightFooter: 'tplInsightFooter'
            },
            selectors: {
                partnerLogoSection: '.js-partner-logo-header',
                ga: '#googleAnalytics',
                insightFooter: '.js-insight-footer',
                innerLinkContainer: '.js-inner-links-container',
                shortcuts: {
                    ILDPSection: '.js-insight-lead-dp-shcut',
                    InsightMapSection: '.js-insight-map-shcut',
                    InsightPollStatsSection: '.js-insight-p-stats-shcut',
                    InsightCompareAndContrast: '.js-insight-compare-shcut',
                    InsightCommentSection: '.js-insight-comments-shcut',
                    InsightRelatedAndSocialSection: '.js-insight-related-shcut'
                }
            },
            api: {
                getPollData: App.config.URL_SERVER + 'PollFindLiteWithMultiSide',
                getInsightEntity: App.config.URL_SERVER + 'InsightFindByWidget',
                increaseViews: App.config.URL_SERVER_API_NEW + 'event-track',
                loadPollPrevNext: App.config.URL_SERVER_API_NEW + 'poll/widget/'
            },
            events: {
                'click .js-insight-nav': 'onNavigateToSection'
            },
            childs: {},
            onInitialize: function() {
                var self = this;

                if (!viewCreated) {
                    self.templatesObject = $.extend({}, self.prepareTpl(mainTpl), self.prepareTpl(mapsTpl));
                    self.dChildrenInited = $.Deferred();

                    if (self.pollId) {
                        self.initListeners();
                        self.preparePage();
                    }

                    viewCreated = true;
                }
            },
            onWindowScroll: function() {
                var self = this,
                    $window = $(window),
                    $fxel = $(self.selectors.innerLinkContainer),
                    eloffset = 130,
                    lastScrollTop = 0;

                $window.scroll(function() {
                    if (eloffset < $window.scrollTop()) {
                        $fxel.addClass("fixed");
                    }
                    else {
                        $fxel.removeClass("fixed");
                    }
                    if ($window.scrollTop() > lastScrollTop) {
                        $fxel.removeClass("mob");
                    }
                    else {
                        $fxel.addClass("mob").removeClass("mobtwo");
                    }
                    lastScrollTop = $window.scrollTop();
                });
            },
            initListeners: function() {
                var self = this;

                self.listenTo(self, 'viewReady', function() {
                    self.onViewReady();
                });
                self.listenTo(self, 'trackEvent', function(event) {
                    self.trackInsightEvent(event);
                });
                self.listenTo(self, 'pollChanged', function(pollId) {
                    self.pollId = pollId;
                    self.onPollChanged();
                });
            },
            onViewReady: function() {
                var self = this;

                self.resizePage();
            },
            trackGAEvent: function() {
                var self = this;

                self.dimension1 = self.insightEntity.guid;
                self.dimension3 = self.insightEntity.partner ? self.insightEntity.partner : undefined;

                ga('set', 'dimension1', self.dimension1);
                ga('set', 'dimension3', self.dimension3);
                ga('send', 'pageview', self.trackerName);
            },
            preparePage: function() {
                var self = this;

                if (self.insightLocale) {
                    self.getInsightEntity().then(function(insight) {
                        self.prepareInsightEntity(insight);
                        self.afterInsightEntityReady();
                    }, function(XHttpRequest, message) {
                        self.hideLoader();
                        alert(message);
                    });
                    
                    if (_.isEmpty(self.poll)) {
                        self.loadPoll().then(function(poll) {
                            self.poll = poll;
                            self.dChildrenInited.then(function() {
                                self.trigger('pollReceived', poll);
                            });
                        }, function() {
                            self.hideLoader();
                            alert('Poll can\'t be loading');
                        });
                        self.loadPollPrevNext().then(function(pollPrevNext) {
                            self.pollPrevNext = pollPrevNext;
                            self.dChildrenInited.then(function() {
                                self.trigger('pollPrevNextReceived', pollPrevNext);
                            });
                        });
                    }
                    else {
                        self.trigger('pollReceived', self.poll);
                    }
                }
                else {
                    alert('Locale is undefined');
                }
            },
            afterInsightEntityReady: function() {
                var self = this;

                self.setMemberOrWHL();
                self.trackGAEvent();
                self.loadAdditionalLibs();
                self.trackInsightEvent('insight_view');

                $.i18n.getDictionaries($.extend({}, self.insightLangConf, {
                    language: [self.insightLocale],
                    callback: function () {
                        self.onTranslationsLoaded();
                    }
                }));
            },
            prepareInsightEntity: function(insight) {
                var self = this;

                self.insightEntity = insight;
                self.insightEntity.sectionColor = self.insightEntity.sectionColor || self.insightDefaultSectionColor;
                self.insightEntity.headerBackgroundColor = self.insightEntity.headerBackgroundColor || self.insightDefaultHeaderBackgroundColor;
            },
            setMemberOrWHL: function() {
                var self =  this,
                    partner = self.insightEntity.partnerObject;

                if (partner) {
                    if (isWhiteLabelHolding(partner)) {
                        self.whiteLabelHoldingOrMember = true;
                    }
                }
                else { // if no info about partner let's assume this is holding
                    self.whiteLabelHoldingOrMember = true;
                }
            },
            onTranslationsLoaded: function() {
                var self = this;

                self.hideLoader();
                self.render();
                self.renderFooterSection();
                self.renderParnterLogoSection();
                self.initChilds();
            },
            renderParnterLogoSection: function() {
                var self = this,partnerHeaderImgUrl;

                if (self.insightEntity.logo && self.insightEntity.logo.image && self.insightEntity.logo.image.url) {
                    partnerHeaderImgUrl = self.insightEntity.logo.image.url;
                }
                else {
                    partnerHeaderImgUrl = '';
                }
                self.$(self.selectors.partnerLogoSection).html(self.getTemplate(self.templates.logoSection, self.templatesObject, {
                    partnerHeaderImgUrl: partnerHeaderImgUrl,
                    sectionColor: self.insightEntity.sectionColor
                }));
            },
            renderFooterSection: function() {
                var self = this;

                self.$(self.selectors.insightFooter).html(self.getTemplate(self.templates.insightFooter, self.templatesObject, {
                    footerText: self.getFooterText(),
                    sectionColor: self.insightEntity.sectionColor,
                    frontStatic: App.config.DEBUG_MODE ?
                        App.config.FRONT_STATIC_DEBUG_WIDGET
                        : App.config.FRONT_STATIC,
                    config: App.config
                }));
            },
            getFooterText: function() {
                var self = this,
                    footerText = $.i18n.mProp(self.insightLocale, 'default_owo_logo_footer_text');

                if (self.whiteLabelHoldingOrMember && App.config.WIDGET_FOOTER_PARTNER_NAME) {
                    footerText = $.i18n.mProp(self.insightLocale, 'default_footer_text_holdings', App.config.WIDGET_FOOTER_PARTNER_NAME);
                }

                return footerText;
            },
            loadAdditionalLibs: function() {
                var self = this,
                    insightEntitySectionVotingMap = self.insightEntity.displaySectionVotingMap,
                    insightEntitySectionPollStats = self.insightEntity.displaySectionPollStats,
                    defaultSectionPollStats = self.defaultSection.displaySectionPollStats;

                if ((insightEntitySectionVotingMap || insightEntitySectionPollStats) || (insightEntitySectionVotingMap === undefined || insightEntitySectionPollStats === undefined && defaultSectionPollStats)) {
                    self.GeoChart = GoogleChartLibLoader();
                }
            },
            initChilds: function() {
                var self = this;

                self.initChildsByPriorities();
                self.dChildrenInited.resolve();
            },
            initChildsByPriorities: function() {
                var self = this,
                    sectionStatusDeffered;

                function setSectionsQueueLoad(sectionsArray, scope, lastSectionStatus) {
                    var sectionsToInit = sectionsArray.length,
                        deferred = new $.Deferred();

                    function initSectionsQueueLoad() {
                        sectionsArray.map(function(sectionName) {
                            var initMethod = 'init' + sectionName;

                            if (typeof scope[initMethod] === 'function') {
                                if (sectionName === 'ILDPSection') {
                                    scope.listenToOnce(scope, sectionName + 'Empty', function() {
                                        sectionsToInit--;
                                        if (!sectionsToInit) {
                                            deferred.resolve();
                                        }
                                    });
                                    scope.listenTo(scope, sectionName + 'Empty', function() {
                                        self.$(self.selectors.shortcuts[sectionName]).hide();
                                    });
                                }

                                scope.listenToOnce(scope, sectionName + 'Ready', function() {
                                    if (self.selectors.shortcuts[sectionName]) {
                                        MiniLoader.hide(self.selectors.shortcuts[sectionName]);
                                    }
                                    sectionsToInit--;
                                    if (!sectionsToInit) {
                                        deferred.resolve();
                                    }
                                });
                                scope[initMethod](sectionName);
                                if (!scope.childs[sectionName]) {
                                    sectionsToInit--;
                                    if (!sectionsToInit) {
                                        deferred.resolve();
                                    }
                                }

                            }
                        });
                    }

                    if (!lastSectionStatus) {
                        initSectionsQueueLoad();
                    }
                    else {
                        $.when(lastSectionStatus).then(function() {
                            initSectionsQueueLoad();
                        });
                    }

                    return deferred;
                }

                self.sectionLoadPriorities.map(function(sectionsArray) {
                    sectionStatusDeffered = setSectionsQueueLoad(sectionsArray, self, sectionStatusDeffered);
                });
            },
            initInsightAdUnitSection: function(sectionName) {
                var self = this;

                self.childs.InsightAdUnitSection = new InsightAdUnitSection({
                    parent: self,
                    insightEntity: self.insightEntity,
                    templatesObject: self.templatesObject,
                    sectionName: sectionName
                });
            },
            initInsightPollInfoSection: function(sectionName) {
                var self = this;

                self.childs.InsightPollInfoSection = new InsightPollInfoSection({
                    parent: self,
                    widgetId: self.widgetId,
                    sectionColor: self.insightEntity.sectionColor,
                    partnerExternalId: self.insightEntity.partnerObject ? self.insightEntity.partnerObject.externalId : '',
                    insightLocale: self.insightLocale,
                    templatesObject: self.templatesObject,
                    sectionName: sectionName
                 });
            },
            initILDPSection: function(sectionName) {
                var self = this,
                    insightEntitySectionLeadDataPoint = self.insightEntity.displaySectionLeadDataPoint,
                    defaultSectionLeadDataPoint = self.defaultSection.displaySectionLeadDataPoint;

                if (insightEntitySectionLeadDataPoint || (insightEntitySectionLeadDataPoint === undefined && defaultSectionLeadDataPoint)) {
                    self.childs.ILDPSection = new ILDPSection({
                        parent: self,
                        widgetCode: self.widgetId,
                        insightEntity: $.extend(true, {}, self.insightEntity),
                        pollId: self.pollId,
                        templatesObject: self.templatesObject,
                        sectionName: sectionName
                    });
                }
            },
            initInsightMapSection: function(sectionName) {
                var self = this,
                    insightEntitySectionVotingMap = self.insightEntity.displaySectionVotingMap,
                    defaultSectionVotingMap = self.defaultSection.displaySectionVotingMap;

                if (insightEntitySectionVotingMap || (insightEntitySectionVotingMap === undefined && defaultSectionVotingMap)) {
                    self.childs.InsightMapSection = new InsightMapSection({
                        parent: self,
                        insightEntity: $.extend(true, {}, self.insightEntity),
                        pollId: self.pollId,
                        poll: self.poll,
                        GeoChart: self.GeoChart,
                        templatesObject: self.templatesObject,
                        sectionName: sectionName
                    });
                }
            },
            initInsightPollStatsSection: function(sectionName) {
                var self = this,
                    insightEntitySectionPollStats = self.insightEntity.displaySectionPollStats,
                    defaultSectionPollStats = self.defaultSection.displaySectionPollStats;

                if (insightEntitySectionPollStats || (insightEntitySectionPollStats === undefined && defaultSectionPollStats)) {
                    self.childs.InsightPollStatsSection = new InsightPollStatsSection({
                        parent: self,
                        pollId: self.pollId,
                        poll: self.poll,
                        sectionColor: self.insightEntity.sectionColor,
                        insightLocale: self.insightLocale,
                        GeoChart: self.GeoChart,
                        templatesObject: self.templatesObject,
                        sectionName: sectionName
                    });
                }
            },
            initInsightCompareAndContrast: function(sectionName) {
                var self = this,
                    insightEntitySectionCompareAndContrast = self.insightEntity.displaySectionCompareAndContrast,
                    defaultSectionCompareAndContrast = self.defaultSection.displaySectionCompareAndContrast;

                if (insightEntitySectionCompareAndContrast || (insightEntitySectionCompareAndContrast === undefined && defaultSectionCompareAndContrast)) {
                    self.childs.InsightCompareAndContrast = new InsightCompareAndContrast({
                        parent: self,
                        pollId: self.pollId,
                        poll: self.poll,
                        insightEntity: $.extend(true, {}, self.insightEntity),
                        templatesObject: self.templatesObject,
                        sectionName: sectionName
                    });
                }
            },
            initInsightSharingSections: function(sectionName) {
                var self = this;

                self.childs.InsightSharingSections = new InsightSharingSections({
                    parent: self,
                    pollId: self.pollId,
                    widgetCode: self.widgetId,
                    templatesObject: self.templatesObject,
                    sectionName: sectionName
                });
            },
            initInsightCommentSection: function(sectionName) {
                var self = this,
                    insightEntitySectionComments = self.insightEntity.displaySectionComments,
                    defaultSectionComments = self.defaultSection.displaySectionComments,
                    whiteLabelHoldingOrMember = !self.whiteLabelHoldingOrMember;

                if ((insightEntitySectionComments || (insightEntitySectionComments === undefined && defaultSectionComments)) && whiteLabelHoldingOrMember) {
                    self.childs.InsightCommentSection = new InsightCommentSection({
                        parent: self,
                        pollId: self.pollId,
                        sectionColor: self.insightEntity.sectionColor,
                        insightLocale: self.insightLocale,
                        templatesObject: self.templatesObject,
                        sectionName: sectionName
                    });
                }
            },
            initInsightRelatedAndSocialSection: function(sectionName) {
                var self = this,
                    insightEntitySectionRelatedAndSocial = self.insightEntity.displaySectionRelatedAndSocial,
                    defaultSectionRelatedAndSocial = self.defaultSection.displaySectionRelatedAndSocial;

                if (insightEntitySectionRelatedAndSocial || (insightEntitySectionRelatedAndSocial === undefined && defaultSectionRelatedAndSocial)) {
                    self.childs.InsightRelatedAndSocialSection = new InsightRelatedAndSocialSection({
                        parent: self,
                        insightEntity: $.extend(true, {}, self.insightEntity),
                        templatesObject: self.templatesObject,
                        sectionName: sectionName
                    });
                }
            },
            onRender: function() {
                var self = this;

                self.renderInsightContainer();
                self.renderInsightInnerLinks();
            },
            onPollChanged: function() {
                var self = this;
                
                self.loadPoll().then(function(poll) {
                    self.poll = poll;
                    self.trigger('pollReceived', poll);
                }, function() {
                    self.hideLoader();
                    alert('Poll can\'t be loading');
                });

                self.loadPollPrevNext().then(function(pollPrevNext) {
                    self.pollPrevNext = pollPrevNext;
                    self.trigger('pollPrevNextReceived', pollPrevNext);
                });
            },
            renderInsightContainer: function() {
                var self = this;

                self.$el.html(self.getTemplate(self.templates.insightContainer, self.templatesObject, {
                    headerBackgroundColor: self.insightEntity.headerBackgroundColor,
                    sectionColor: self.insightEntity.sectionColor
                }));
            },
            renderInsightInnerLinks: function() {
                var self = this,
                    loaderIcon = '<div class="js-loader-hide-container loaderContainer loaderIcon"></div>';

                self.$(self.selectors.innerLinkContainer).html(self.getTemplate(self.templates.insightInnerLinks, self.templatesObject, {
                    insightEntity: self.insightEntity,
                    headerBackgroundColor: self.insightEntity.headerBackgroundColor,
                    insightLocale: self.insightLocale,
                    loaderIcon: loaderIcon,
                    whiteLabelHoldingOrMember: self.whiteLabelHoldingOrMember
                }));
                self.onWindowScroll();
            },
            resizePage: function() {
                var self = this,
                    outerHeight;

                outerHeight = self.getOuterHeight();

                self.postMessage('action', {
                    method: 'resize',
                    arguments: [self.widgetToken, '100%', outerHeight + 'px', '320px'] // move to settings
                });
            },
            getOuterHeight: function() {
                var self = this,
                    curStyle = self.el.currentStyle || window.getComputedStyle(self.el);
                    outerHeight = self.el.offsetHeight;
                    outerHeight += parseInt(curStyle.marginTop);
                    outerHeight += parseInt(curStyle.marginBottom);

                return outerHeight;
            },
            postMessage: function(type, data) {
                parent.postMessage({
                    type: type,
                    data: data
                }, '*');
            },
            onNavigateToSection: function(e) {
                var self = this,
                    hash = $(e.currentTarget)[0].hash,
                    $innerLinkContainer = self.$(self.selectors.innerLinkContainer),
                    containerHeight = $innerLinkContainer.height(),
                    offsetTop = self.$(hash).offset().top,
                    shift;

                e.preventDefault();

                if (containerHeight < 120 && containerHeight > 80) {
                     shift = offsetTop - 120;
                } 
                else if (containerHeight === 145) {
                    shift = offsetTop - 145 - 5;
                }
                else if (containerHeight === 114) {
                    shift = offsetTop - 120 -114;
                } 
                else {
                    shift = offsetTop - 135 - 210 - 15;
                }
                
                window.scrollTo(0, shift);

                $innerLinkContainer.addClass("mobtwo");
            },
            getInsightEntity: function() {
                var self = this;

                return self.ajax({
                    url: self.api.getInsightEntity,
                    showLoader: false,
                    dataType: 'json',
                    type: 'GET',
                    data: {
                        widgetCode: self.widgetId
                    }
                });
            },
            loadPoll: function() {
                var self = this;

                return self.ajax({
                    url: self.api.getPollData,
                    showLoader: false,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        pollId: self.pollId,
                        locale: self.insightLocale
                    }
                });
            },
            loadPollPrevNext: function() {
                var self = this;

                return self.ajax({
                    url: self.api.loadPollPrevNext + self.widgetId + '/' + self.insightLocale + '/' + self.pollId,
                    showLoader: false,
                    type: 'GET',
                    dataType: 'json'
                });
            },
            trackInsightEvent: function(event) {
                var self = this;

                return self.ajax({
                    url: self.api.increaseViews,
                    showLoader: false,
                    type: 'GET',
                    data: {
                        sourceType: 'insight',
                        poll: self.pollId,
                        sourceCode: self.insightEntity.guid,
                        event: event
                    }
                });
            }
        });

        return insightMainView;
    }
);