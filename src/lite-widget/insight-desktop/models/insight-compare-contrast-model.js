define(
    'insight-compare-contrast-model',
    [
        'app'
    ],
    function(App) {
        var InsightCompareContrast = App.Model.defaultModel.extend({
                defaults: {
                    '@type': 'com.oneworldonline.backend.entities.InsightSideVotesStatsDto',
                    'otherVotes': {},
                    'partnerVotes': {},
                    'totalOtherSitesVotes': 0,
                    'totalThisSiteVotes': 0
                },
                initialize: function() {
                    var self = this;

                    self.calculateTotalVotesBySource('otherVotes');
                    self.calculateTotalVotesBySource('partnerVotes');
                },
                calculateTotalVotesBySource: function(source) {
                    var self = this,
                        total,
                        votes = self.get(source);

                    total = _.reduce(_.values(votes), function(memo, num) {
                        return memo + num;
                    }, 0);

                    votes.total = total;
                    self.set(source, votes);
                }
            });

        return InsightCompareContrast;
    }
);