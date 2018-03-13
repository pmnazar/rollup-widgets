define(
    'insight-poll-info-collection',
    [
        'collections/insight-poll-sides-collection'
    ],
    function(InsightPollSidesCollection) {
        var InsightPollInfoCollection = InsightPollSidesCollection.extend({
            totalVotes: 0,
            voted: false,
            precision: 0,
            onCollectionSet: function() {
                var self = this;

                self.mapSettings();
                self.voted = _.some(self.models, function(model) {
                    return model.get('voted');
                });
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
            },
            voteForSide: function(sideId, votedForSide) {
                var self = this,
                    model = self.findWhere({id: sideId}),
                    lastVotedSide;

                model.set('votes', model.get('votes') + 1);
                model.set('voted', true);
                if (self.voted) {
                    lastVotedSide = self.findWhere({id: votedForSide});
                    lastVotedSide.set('votes', lastVotedSide.get('votes') - 1);
                    lastVotedSide.set('voted', false);
                }
                else {
                    self.totalVotes++;
                    self.voted = true;
                }
                self.lastVotedSide = sideId;
                self.calculateSideVotesPercents();
                self.trigger('votesUpdated');
            }
        });

        return InsightPollInfoCollection;
    }
);
