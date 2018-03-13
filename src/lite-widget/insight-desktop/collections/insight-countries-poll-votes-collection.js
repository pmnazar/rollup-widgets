define(
    'insight-countries-poll-votes-collection',
    [
        'app',
        'models/default-model'
    ],
    function(App, DefaultModel) {
        var InsightCountriesPollVotesCollection = App.Collection.defaultCollection.extend({
            model: DefaultModel.extend({
                defaults: {
                    '@type': 'com.oneworldonline.backend.entities.VotesDistributionByRegionDto',
                    'regionCode': '',
                    'regionName': '',
                    'regionType': '',
                    'sidesVotes': {},
                    'totalVotes': 0,
                    'sideById': {}
                }
            }),
            sortOrder: 'desc',
            comparator: function(model) {
                var self = this,
                    order = self.sortOrder === 'desc' ? -1: 1;
                return order * model.get('totalVotes');
            },
            precision: 1,
            defaultCodeCountryToZoom: null,
            votesPercentageBeforeSwitchMap: 75,
            sidesCollection: {},
            overallVotes: 0,
            onCollectionSet: function() {
                var self = this;

                self.calculateTotalsBySides();

                if ( self.models.length ) {
                    self.setDefaultCodeCountryToZoom();
                }
            },
            calculateTotalsBySides: function() {
                var self = this,
                    sidesVotes = {},
                    votesByRegion = 0,
                    overallVotes = 0;

                _.each(self.models, function(model) {
                    sidesVotes = model.get('sidesVotes');

                    votesByRegion = _.reduce(_.values(sidesVotes), function(memo, num) {
                        overallVotes += num;

                        return memo + num;
                    }, 0);
                    model.set('totalVotes', votesByRegion);
                });

                self.overallVotes = overallVotes;
                self.sort();
            },
            setSidesCollection: function(sidesCollection) {
                var self = this;

                self.sidesCollection = sidesCollection.clone();
                self.prepareSidesByIdProp();
            },
            getVotesInPercentFromModelBySideId: function(model, sideModel, sideId) {
                var sideVotesInPercents,
                    sidesVotes = model.get('sidesVotes'),
                    totalVotes = model.get('totalVotes');

                if ( sideId in sidesVotes && sidesVotes[sideId] > 0 ) {
                    sideVotesInPercents = (sidesVotes[sideId] / totalVotes * 100).toFixed(self.precision);
                }
                else {
                    sideVotesInPercents = 0;
                }

                return sideVotesInPercents;
            },
            prepareSidesByIdProp: function() {
                var self = this;

                _.each(self.models, function(model) {
                    var sideById = {},
                        sideId;

                    _.each(self.sidesCollection.models, function(sideModel) {
                        sideId = sideModel.get('id');
                        sideById[sideId] = {};
                        sideById[sideId].sideAnswer = sideModel.get('answer');
                        sideById[sideId].sideColor = sideModel.get('sideColor');
                        sideById[sideId].sideVotesInPercents = self.getVotesInPercentFromModelBySideId(model, sideModel, sideId);
                        sideModel.set('sideVotesInPercents', sideById[sideId].sideVotesInPercents);
                    });
                    sideById.totalVotes = model.get('totalVotes');
                    model.set('sideById', sideById);
                });
            },
            setDefaultCodeCountryToZoom: function() {
                var self = this,
                    maximumVotes;

                maximumVotes = _.max(self.models, function(model) {
                    return model.get('totalVotes');
                });

                if ( (maximumVotes.get('totalVotes') / self.overallVotes * 100) >= self.votesPercentageBeforeSwitchMap ) {
                    self.defaultCodeCountryToZoom = maximumVotes.get('regionCode');
                }
            }
        });

        return InsightCountriesPollVotesCollection;
    }
);