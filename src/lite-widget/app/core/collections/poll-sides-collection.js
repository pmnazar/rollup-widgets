define(
    'collections/poll-sides-collection',
    [
        'app',
        'models/poll-side-model'
    ],
    function(App, pollSideModel) {
        var pollSidesCollection = App.Collection.defaultCollection.extend({
            model: pollSideModel,
            recalculatePercentageOfSides: function(totalVotes) {
                var sides = this,
                    sumPercentage = 0,
                    lastVotedSideIndex = 0,
                    lastVotedSide,
                    votesPercent,
                    delta;

                sides.each(function(side, i) {
                    votesPercent = 0 !== totalVotes ? parseInt((side.get('votes') * 100 / totalVotes).toFixed()) : 0;
                    side.set({votesPercent: votesPercent});
                    sumPercentage += side.get('votesPercent');

                    if (side.get('votes')) {
                        lastVotedSideIndex = i;
                    }
                });

                delta = (0 !== totalVotes) ? 100 - sumPercentage : 0;
                lastVotedSide = sides.at(lastVotedSideIndex);
                lastVotedSide.set({votesPercent: lastVotedSide.get('votesPercent') + delta});
            },
            getColorsArray: function() {
                var self = this,
                    result = [];

                self.each(function(model) {
                    result.push(model.get('sideColor'));
                });

                return result;
            }
        });

        return pollSidesCollection;
    }
);