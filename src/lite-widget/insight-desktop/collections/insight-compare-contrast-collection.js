define(
    'insight-compare-contrast-collection',
    [
        'app',
        'helpers/statistic/separate-each-1K',
        'models/insight-compare-contrast-model'
    ],
    function(App, SeparateEach1K, InsightCompareContrastModel) {
        var InsightCompareContrastCollection = App.Collection.defaultCollection.extend({
            model: InsightCompareContrastModel,
            format: 'each1K',
            detailFormat: 'percents',
            precision: 0,
            getTotal: function(propertyName, mode) {
                var self = this,
                    model = self.models[0],
                    value;

                mode = mode || self.format;
                value = model.get(propertyName);

                return self.formatTotalStats(value, mode);
            },
            getSidesVotes: function(source, mode) {
                var self = this,
                    model = self.models[0],
                    votesBySource = model.get(source),
                    formatedVotes = {};

                mode = mode || self.detailFormat;

                $.each(_.omit(votesBySource, ['total']), function(id, value) {
                    formatedVotes[id] = self.formatDetailsStats(id, votesBySource, mode);
                });

                return formatedVotes;
            },
            formatDetailsStats: function(id, votesBySource, mode) {
                var self = this,
                    result,
                    value = votesBySource[id],
                    formatBy = {
                        'percents': function(val) {
                            var result = 0,
                                total = votesBySource.total;

                            result = 0 !== total ? parseInt((val * 100 / total).toFixed(self.precision)) : 0;

                            return result + '%';
                        }
                    };

                if ( mode in formatBy ) {
                    result = formatBy[mode](value);
                }
                else {
                    result = value;
                }

                return result;
            },
            formatTotalStats: function(value, mode) {
                var self = this,
                    result,
                    formatBy = {
                        'each1K': function(number) {
                            return SeparateEach1K(number);
                        },
                        // 'toFriendlyNumber': function(number) {
                        //     return ToFriendlyNumber(number, self.precision);
                        // }
                    };

                if ( mode in formatBy ) {
                    result = formatBy[mode](value);
                }
                else {
                    result = value;
                }

                return result;
            }
        });

        return InsightCompareContrastCollection;
    }
);