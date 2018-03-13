define(
    'insight-poll-sides-collection',
    [
        'helpers/settings/side-colors',
        'collections/poll-sides-collection',
        'models/poll-side-model'
    ],
    function(sideColors, pollSidesCollection, pollSideModel) {
        var InsightPollSidesCollection = pollSidesCollection.extend({
            model: pollSideModel,
            sideColors: sideColors,
            trueIdentityCssClassIndex: [
                'trId-1',
                'trId-2',
                'trId-3',
                'trId-4',
                'trId-5',
                'trId-6',
                'trId-7',
                'trId-8',
                'trId-9',
                'trId-10'
            ],
            onCollectionSet: function() {
                var self = this;

                self.mapSettings();
            },
            mapSettings: function() {
                var self = this;

                _.each(self.models, function(side, index) {
                    side.set('sideColor', self.sideColors[index]);
                    side.set('trueIdentityCssClassIndex', self.trueIdentityCssClassIndex[index]);
                });
            }
        });

        return InsightPollSidesCollection;
    }
);