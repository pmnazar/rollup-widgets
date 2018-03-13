define(
    'insight-poll-stats-collection',
    [
        'collections/insight-poll-sides-collection'
    ],
    function(InsightPollSidesCollection) {
        var InsightPollStatsCollection = InsightPollSidesCollection.extend({
            totalVotes: 0,
            precision: 0,
            onCollectionSet: function() {
                var self = this;

                self.mapSettings();
                self.calculateTotals();
            },
            calculateTotals: function() {
                var self = this;

                self.calculateTotalVotes();
                self.calculateSideVotesPercents();
            },
            calculateTotalVotes: function() {
                var self = this,
                    totalVotes = 0;

                $.each(self.models, function(index, side) {
                    totalVotes += side.get('votes');
                });

                self.totalVotes = totalVotes;
            },
            calculateSideVotesPercents: function() {
                var self = this,
                    votes;

                $.each(self.models, function(index, side) {
                    votes = side.get('votes');
                    side.set('votesFromTotalInPercent', self.getVotesInPercent(votes));
                });
            },
            getVotesInPercent: function(votes) {
                var self = this,
                    result;

                result = 0 !== self.totalVotes ? parseInt((votes * 100 / self.totalVotes).toFixed(self.precision)) : 0;

                return result;
            }
        });

        return InsightPollStatsCollection;
    }
);