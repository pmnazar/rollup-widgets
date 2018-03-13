define(
    'insight-true-identity-model',
    [
        'app'
    ],
    function(App) {
        var InsightTrueIdentity = App.Model.defaultModel.extend({
            urlRoot: App.config.URL_SERVER + 'PollLoadComparison',
            defaults: {
                age: 0,
                education: 0,
                gender: 0,
                income: 0,
                maritalStatus: 0,
                politicalAffiliation: 0,
                ageIconIndex: 0,
                educationIconIndex: 0,
                genderIconIndex: 0,
                incomeIconIndex: 0,
                maritalStatusIconIndex: 0,
                politicalAffiliationIconIndex: 0,
                ageComparisonValue: 0,
                educationComparisonValue: 0,
                genderComparisonValue: 0,
                incomeComparisonValue: 0,
                maritalStatusComparisonValue: 0,
                politicalAffiliationComparisonValue: 0
            },
            sortingIntervals: [
                { start: 0, end: 1, index: 1, modelAttr: { silent: true } },
                { start: 1, end: 2, index: 2, modelAttr: { silent: true } },
                { start: 2, end: 2.5, index: 3, modelAttr: { silent: true } },
                { start: 2.5, end: 3, index: 4, modelAttr: { silent: true } },
                { start: 3, end: 4, index: 5, modelAttr: { silent: true } },
                { start: 4, end: 5, index: 6, modelAttr: { silent: true } }
            ],
            initialize: function() {
                var self = this;

                self.on('change', self.processChangedAttributes);
            },
            processChangedAttributes: function() {
                var self = this,
                    changedAttributes = self.changedAttributes(),
                    intervals = self.sortingIntervals;

                for (var attrName in changedAttributes) {
                    var changedAttributeValue = changedAttributes[attrName];
                    self.calculateComparisonValues(changedAttributeValue, attrName);

                    for (var i in intervals) {
                        if (intervals[i].start < changedAttributeValue && changedAttributeValue <= intervals[i].end) {
                            self.calculateTrueIdentityIconsIndexes(attrName, intervals[i].index);
                            self.set('isModelChanged', true, {silent: true});
                            break;
                        }
                        else if (changedAttributeValue == 0)  {
                            self.calculateTrueIdentityIconsIndexes(attrName, 0);
                            self.set('isModelChanged', false, {silent: true});
                        }
                    }
                }
            },
            calculateComparisonValues: function(changedAttributeValue, attrName) {
                var self = this;
                var comparisonValue = {};
                comparisonValue[attrName + 'ComparisonValue'] = Math.round(changedAttributeValue * 20);
                self.set(comparisonValue, {silent: true});
            },
            calculateTrueIdentityIconsIndexes: function(attrName, value) {
                var self = this;
                var iconsIndexes = {};
                iconsIndexes[attrName + 'IconIndex'] = value;
                self.set(iconsIndexes, {silent: true});
            }
        });

        return InsightTrueIdentity;
    }
);