define(
    'models/smart-multiside-poll-model',
    [
        'app',
        'models/poll-model',
        'collections/smart-collection'
    ],
    function(App, pollModel, smartCollection) {
        var smartMultiSidePollModel = pollModel.extend({
            defaults: {
                totalVotes: 0,
                sides: []
            },
            isActionsForVotedPollShown: false,
            isActionsForVotedPollNeeded: false,
            initialize: function() {
                var poll = this;

                poll.set({
                    sides: poll.createSidesCollection()
                });

                poll.get('sides').recalculatePercentageOfSides(poll.get('totalVotes'));

                if (poll.get('votedForSide') || 'closed' === poll.get('status')) {
                    poll.isActionsForVotedPollNeeded = true;
                }
                
                poll.afterInitialize();
            },
            afterInitialize: function() {
                /* abstract method */
            },
            createSidesCollection: function() {
                var poll = this;

                return new smartCollection(poll.get('sides'));
            }
        });

        return smartMultiSidePollModel;
    }
);