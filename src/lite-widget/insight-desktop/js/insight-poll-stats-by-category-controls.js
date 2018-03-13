define(
    'insight-poll-stats-by-category-controls',
    [
        'app',
        'default',
        'collections/insight-poll-stats-collection'
    ],
    function (App, DefaultView, InsightPollStatsCollection) {
        var PollStatsByCategoryControls = DefaultView.extend({
            el: '.js-insight-poll-stats-tabs-content',
            api: {
                loadPollStats: App.config.URL_SERVER + 'PollLoadStatsForMultiSide'
            },
            template: 'tplInsightPollStatsTabs',
            insightLocale: '',
            events: {
                'click .js-tab': 'tabClick'
            },
            onInitialize: function() {
                var self = this;

                self.initCollections();
                self.loadPollStats().then(function(stats) {
                    self.parent.trigger('pollStatsReceived', stats.statistics);
                    self.prepareStats(stats.statistics);
                    self.render();
                });
            },
            initCollections: function() {
                var self = this;

                self.sidesCollection = new InsightPollStatsCollection();
                self.sidesCollection.set(self.pollSides);
            },
            prepareStats: function(stats) {
                var self = this;

                self.stats = stats;
                $.each( self.stats, function(statKey, group) {
                     $.each( group.pies, function(sbGroupName, values) {
                        var groupped = [];

                        $.each( values, function(id, votesInPercents) {
                            var matchModel = self.sidesCollection.findWhere({ id: Number(id) });

                            groupped.push({
                                answer: matchModel.get('answer'),
                                votesInPercents: votesInPercents
                            });
                        });
                        group.pies[sbGroupName].groupped = groupped;
                     });
                });
            },
            tabClick: function(e) {
                var self = this,
                    $currentTarget = $(e.currentTarget),
                    targetClass = $currentTarget.data('targetClass'),
                    nodeClass = $currentTarget.data('node'),
                    targetId = $currentTarget.data('targetTab');

                e.preventDefault();
                e.stopPropagation();
                self.$('.'+ nodeClass + ' > li').each(function(index, el) {
                    $(el).removeClass('active');
                });

                $currentTarget.parent().addClass('active');

                self.$('.'+ targetClass).each(function(index, el) {
                    $(el).removeClass('active');
                });

                self.$(targetId).addClass('active');
            },
            onRender: function() {
                var self = this;

                self.$el.html(self.getTemplate(self.template, self.templatesObject, {
                    insightLocale: self.insightLocale,
                    stats: self.stats
                }));
            },
            loadPollStats: function() {
                var self = this;

                self.parent.showSectionLoader();

                return self.ajax({
                    url: self.api.loadPollStats,
                    type: 'POST',
                    showLoader: false,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        pollId: self.pollId
                    }),
                });
            }
        });

        return PollStatsByCategoryControls;
    }
);