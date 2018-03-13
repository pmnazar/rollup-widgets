define(
    'insight-true-identity-section',
    [
        'app',
        'default',
        'models/insight-true-identity-model'
    ],
    function (App, DefaultView, InsightTrueIdentityModel) {
        var InsightTrueIdentitySection = DefaultView.extend({
            el: '.js-insight-true-identity-section',
            template: 'tplInsightTrueIdentity',
            api: {
                getIdentityData: App.config.URL_SERVER +  'PollLoadComparison'
            },
            enTIStatsOrder: ['genderIconIndex', 'ageIconIndex', 'maritalStatusIconIndex', 'educationIconIndex', 'incomeIconIndex', 'politicalAffiliationIconIndex'],
            nonEnTIStatsOrder: ['genderIconIndex', 'ageIconIndex', 'maritalStatusIconIndex'],
            TIStatsOrder: [],
            translationsBase: 'ui.overall.insight.true-identity-section.',
            trueIdentityCssClassMap: {
                maritalStatusIconIndex: 'tr-id-mar-stat',
                politicalAffiliationIconIndex: 'tr-id-polit-affil',
                genderIconIndex: 'tr-id-gender',
                ageIconIndex: 'tr-id-age',
                educationIconIndex: 'tr-id-education',
                incomeIconIndex: 'tr-id-income'
            },
            poll: {},
            pathToSvg: App.config.DOMAIN_URL + 'external/img/overall/true-identity.svg', 
            events: {
            },
            onInitialize: function() {
                var self = this;

                self.InsightTrueIdentityModel = new InsightTrueIdentityModel();
                self.setTIStatsOrder();
                self.initListeners();
            },
            setTIStatsOrder: function() {
                var self =  this;

                if ( self.insightLocale !== 'en' ) {
                    self.TIStatsOrder = self.nonEnTIStatsOrder.slice();
                }
                else {
                    self.TIStatsOrder = self.enTIStatsOrder.slice();
                }
            },
            initListeners: function() {
                var self = this;

                self.listenTo(self.InsightTrueIdentityModel, 'sync', function() {
                    self.render();
                });

                if ( !_.isEmpty(self.poll) ) {
                    self.onPollReceived(self.poll);
                }
                else {
                    self.listenTo(self.parent, 'pollReceived', function(poll) {
                        self.onPollReceived(poll);
                    });
                }
            },
            onPollReceived: function(poll) {
                var self = this;

                self.InsightTrueIdentityModel.fetch({
                    data: {
                        pollId: poll.id,
                        locale: self.insightLocale
                    }
                });

                self.render();
            },
            setQueryParams: function(poll) {
                var self = this;

                self.InsightTrueIdentityModel({
                    apiParams: {
                        pollId: poll.id,
                        locale: self.insightLocale
                    }
                });
            },
            onRender: function() {
                var self = this,
                    trueIdentity = self.InsightTrueIdentityModel.toJSON(),
                    genderIconIndex = (trueIdentity.genderIconIndex >= 4) ? 'female' : 'male',
                    partnersGenderIconIndex = (genderIconIndex === 'female') ? 'male' : 'female',
                    pathToSvgAgePartnersGenderIconIndex = self.pathToSvg + '#age-'+ partnersGenderIconIndex +'-' + trueIdentity.ageIconIndex,
                    pathToSvgAgePartnersGenderIconIndex0 = self.pathToSvg + '#age-'+ partnersGenderIconIndex +'-0',
                    pathToSvgIncomePartnersGenderIconIndex = self.pathToSvg + '#income-'+ partnersGenderIconIndex + '-' + trueIdentity.incomeIconIndex,
                    pathToSvgAgeGenderIconIndex = self.pathToSvg + '#age-' + genderIconIndex + '-' + trueIdentity.ageIconIndex,
                    pathToSvgAgeGenderIconIndex0 = self.pathToSvg + '#age-' + genderIconIndex + '-0',
                    pathToSvgIncomeGenderIconIndex = self.pathToSvg + '#income-' + genderIconIndex + '-' + trueIdentity.incomeIconIndex,
                    pathToSvgAgeGenderIconIndexEducation = self.pathToSvg + '#age-' + genderIconIndex + '-' + trueIdentity.ageIconIndex + '-education-' + trueIdentity.educationIconIndex,
                    arrayOfIdentitiesParams =  _.reject(_.values(self.InsightTrueIdentityModel.attributes), function(num) {
                        return num === 0;
                    });


                self.$el.html(self.getTemplate(self.template, self.templatesObject, {
                    pathToSvg: self.pathToSvg,
                    uniqueSvgId: new Date().getTime(),
                    trueIdentity: trueIdentity,
                    TIStatsOrder: self.TIStatsOrder,
                    insightLocale: self.insightLocale,
                    genderIconIndex: genderIconIndex,
                    partnersGenderIconIndex: partnersGenderIconIndex,
                    pathToSvgAgePartnersGenderIconIndex: pathToSvgAgePartnersGenderIconIndex,
                    pathToSvgIncomePartnersGenderIconIndex: pathToSvgIncomePartnersGenderIconIndex,
                    pathToSvgAgeGenderIconIndex: pathToSvgAgeGenderIconIndex,
                    pathToSvgIncomeGenderIconIndex: pathToSvgIncomeGenderIconIndex,
                    pathToSvgAgeGenderIconIndex0: pathToSvgAgeGenderIconIndex0,
                    pathToSvgAgePartnersGenderIconIndex0: pathToSvgAgePartnersGenderIconIndex0,
                    pathToSvgAgeGenderIconIndexEducation: pathToSvgAgeGenderIconIndexEducation,
                    translationsBase: self.translationsBase,
                    trueIdentityCssClassMap: self.trueIdentityCssClassMap,
                    showNoteMark: arrayOfIdentitiesParams.length ? true : false
                }));
            }
        });

        return InsightTrueIdentitySection;
    }
);