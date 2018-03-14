define(
    'helpers/maps/google-geo-chart',
    function() {
        var helper = {};

        helper.getMaxVotedSideId = function (sides) {
            return _.invert(sides)[_.max(sides)];
        };

        helper.prepareRegionSidesTooltip = function (sidesCollection, regionSidesVotes) {
            var totalVotes = 0,
                collection = sidesCollection.clone(),
                regionVotesById = {},
                precision = 3;

            for (var i in regionSidesVotes) {
                totalVotes += regionSidesVotes[i];
            }

            collection.each(function(sideModel) {
                var sideId = sideModel.get('id');

                regionVotesById[sideId] = {};
                regionVotesById[sideId].sideColor = sideModel.get('sideColor');
                regionVotesById[sideId].sideAnswer = sideModel.get('answer');

                regionVotesById[sideId].sideVotesInPercents = ((sideId in regionSidesVotes && regionSidesVotes[sideId] > 0)
                    ? (Number(regionSidesVotes[sideId] / totalVotes * 100)).toPrecision(precision) : 0);
            });

            regionVotesById.totalVotes = totalVotes;

            return regionVotesById;
        };

        helper.prepareAxisCollection = function (sidesCollection, regions) {
            var maxVotedSides = {},
                sidesColl = sidesCollection.clone(),
                regionsColl = regions.clone();

             regionsColl.each(function(region) {
                var maxSideId = helper.getMaxVotedSideId(region.get('sidesVotes'));
                maxVotedSides[maxSideId] = maxSideId;
            });

            sidesColl.each(function(model) {
                if (!_.has(maxVotedSides, model.get('id'))) {
                    sidesColl.remove(model);
                }
            });

            return sidesColl;
        };

        return helper;
    }
);