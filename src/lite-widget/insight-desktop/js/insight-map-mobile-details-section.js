define(
    'insight-map-mobile-details-section',
    [
        'app',
        'default',
        'collections/insight-poll-sides-collection'
    ],
    function (App, DefaultView, InsightPollSidesCollection) {
        var InsightMapMobileDetailsSection = DefaultView.extend({
            el: '.js-votes-map-mobile-details',
            voteCollection: {},
            regionName: '',
            template: 'tplMobileDetailsVotesTable',
            insightLocale: '',
            onInitialize: function() {
                var self = this;

                self.initCollection();
                self.initListeners();
            },
            initCollection: function() {
                var self = this;

                self.sidesCollection = new InsightPollSidesCollection();
            },
            initListeners: function() {
                var self = this;

                self.listenTo(self.parent, 'renderMobileDetailsVoteTable', function(poll) {
                    self.onRenderMobileDetailsVoteTable(poll);
                });
            },
            onRenderMobileDetailsVoteTable: function(poll) {
                var self = this;

                self.poll = poll;
                self.sidesCollection.set(poll.sides);
                self.render();
            },
            onRender: function() {
                var self = this;

                self.$el.html(self.getTemplate(self.template, self.parent.templatesObject, {
                    sidesCollection: self.sidesCollection,
                    votedForSide: self.poll.votedForSide,
                    insightLocale: self.insightLocale,
                    sectionColor: self.insightEntity.sectionColor
                }));
            }
        });

        return InsightMapMobileDetailsSection;
    }
);