define(
    'insight-lead-data-point-section',
    [
        'app',
        'default',
        'helpers/Date/format-date'
    ],
    function (App, DefaultView, FormatDate) {
        var ILDPSection = DefaultView.extend({
            el: '.js-ldp-section',
            voteCollection: {},
            template: 'tplInsightLDPSection',
            defaultArticleImgPath: 'https://d2fw4nb4g546bx.cloudfront.net/poll_iconff94689d-b32c-40b4-aeb7-af1f153761a1-0',
            defaultArticleImgSize: '-109x109',
            dateFomat: App.config.DATE_FORMAT,
            api: {
                getInsightDataPoint: App.config.URL_SERVER +  'InsightReadMoreLink'
            },
            poll: {},
            insightDPEntity: {},
            events: {
                'click .js-link-read-more': 'onReadMoreClk'
            },
            onInitialize: function() {
                var self = this;

                self.initListeners();
                self.prepareView();
            },
            initListeners: function() {
                var self = this,
                    $navLeadDpSection = $('.js-insight-lead-dp-shcut');

                self.listenTo(self.parent, 'pollReceived', function(poll) {
                    self.pollId = poll.id;

                    $navLeadDpSection.show();
                    self.prepareView();
                });
            },
            prepareView: function() {
                var self = this;

                self.showSectionLoader();
                $.when(self.getInsightDataPoint()).then(function(insightDPEntity) {
                    if (insightDPEntity && insightDPEntity.id) {
                        self.insightDPEntity = insightDPEntity;
                        self.render();
                        self.parent.trigger('viewReady', self);
                        self.parent.trigger(self.sectionName + 'Ready');
                        self.hideSectionLoader();
                    }
                    else {
                        self.$el.empty();
                        self.parent.trigger(self.sectionName + 'Empty');
                    }
                }, function(XHttpRequest, message) {
                    //https://redmine.1worldonline.biz/issues/9130 - do nothing on api error
                });
            },
            onRender: function() {
                var self = this,
                    articleImgUrl = self.insightDPEntity.icon ? self.insightDPEntity.icon + self.defaultArticleImgSize : self.defaultArticleImgPath + self.defaultArticleImgSize;

                self.$el.html(self.getTemplate(self.template, self.templatesObject, {
                    insightDPEntity: self.insightDPEntity,
                    articleImgUrl: articleImgUrl,
                    sourcePublished: FormatDate(new Date(self.insightDPEntity.sourcePublished), self.dateFomat),
                    insightLocale: self.insightEntity.widgetLocale,
                    sectionColor: self.insightEntity.sectionColor
                }));
            },
            onReadMoreClk: function() {
                var self = this;

                self.parent.trigger('trackEvent', 'insight_1Index_click');
            },
            getInsightDataPoint: function() {
                var self = this;

                return self.ajax({
                    url: self.api.getInsightDataPoint,
                    showLoader: false,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        widgetCode: self.widgetCode,
                        pollId: self.pollId
                    }
                });
            }
        });

        return ILDPSection;
    }
);