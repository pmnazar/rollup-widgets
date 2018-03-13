define(
    'insight-map-details-section',
    [
        'default'
    ],
    function (DefaultView) {
        var InsightMapDetailsSection = DefaultView.extend({
            el: '.js-votes-details-table',
            voteCollection: {},
            regionName: '',
            template: 'tplDisplayDetailsVotesTable',
            selectors: {
                tableContentSelector: '.js-detailed-table',
            },
            insightLocale: '',
            onInitialize: function() {
                var self = this;

                self.initListeners();
            },
            initListeners: function() {
                var self = this;

                self.listenTo(self.parent, 'renderDetailsVoteTable', function(options) {
                    self.onRenderDetailsVoteTable(options);
                });
            },
            onRenderDetailsVoteTable: function(options) {
                var self = this;

                self.voteCollection = options.collection;
                self.regionName = options.region;
                self.render();
            },
            onRender: function() {
                var self = this;

                self.$el.html(self.getTemplate(self.template, self.templatesObject, {
                    collection: self.voteCollection,
                    insightLocale: self.insightLocale,
                    regionName: self.regionName
                }));
                self.parent.trigger('viewReady', self);
            }
        });

        return InsightMapDetailsSection;
    }
);