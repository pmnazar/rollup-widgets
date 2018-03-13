define(
    'insight-map-sections',
    [
        'app',
        'default',
        'insight-map-details-section',
        'insight-third-level-map',
        'insight-map-mobile-details-section',
        'collections/insight-poll-sides-collection',
        'collections/insight-countries-poll-votes-collection',
        'helpers/maps/google-geo-chart'
    ],
    function (App,
        DefaultView,
        InsightMapDetailsSection,
        InsightThirdLevelMap,
        InsightMapMobileDetailsSection,
        InsightPollSidesCollection,
        InsightCountriesPollVotesCollection,
        GeoChartHelper
        ) {
        var InsightMapSection = DefaultView.extend({
            el: '.js-maps-section',
            templates: {
                viewBlock: 'tplPollVotesMap',
                mapTooltip: 'tplOverallMapToolTip'
            },
            api: {
                getVotesByLocation: App.config.URL_SERVER + 'PollFindVotesMapByLocation'
            },
            selectors: {
                mapMainContainer: '.js-map-main',
                mainSection: '.js-main',
                mapDetailsContainer: '.js-map-details',
                detailsSection: '.js-details'
            },
            childs: {},
            d_getVotes: null,
            GeoChart: {},
            countriesVotesCollection: null,
            sidesCollection: null,
            regionVotesCollection: null,
            isMobileDevice: false,
            geoChartDefaults: {
                height: 420,
                projection: {
                    name:'kavrayskiy-vii'
                },
                tooltip: { isHtml: true }
            },
            geoChartMobileHeight: 320,
            events: {
                'click .js-show-world-btn': 'drawGeoChartCountries'
            },
            onInitialize: function() {
                var self = this;

                self.d_getVotes = $.Deferred();
                self.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

                if ( self.isMobileDevice ) {
                    self.geoChartDefaults.height = self.geoChartMobileHeight;
                }

                self.initCollections();
                self.initListeners();

                self.prepareVotesData();
            },
            prepareVotesData: function() {
                var self = this,
                    requestData = {
                        pollId: self.pollId
                    };

                self.showSectionLoader();

                $.when(self.loadVotes(requestData)).then(function(countriesVotes) {
                    self.d_getVotes.resolve(countriesVotes);
                }, function(XHttpRequest, message) {
                    self.hideSectionLoader();
                    alert(message);
                });
            },
            initCollections: function() {
                var self = this;

                self.sidesCollection = new InsightPollSidesCollection();
                self.countriesVotesCollection = new InsightCountriesPollVotesCollection();
                self.regionVotesCollection = new InsightCountriesPollVotesCollection();
            },
            initChilds: function() {
                var self = this;

                if ( self.isMobileDevice ) {
                    self.childs.insightMapMobileDetails = new InsightMapMobileDetailsSection({
                        parent: self,
                        insightEntity: self.insightEntity,
                        insightLocale: self.insightEntity.widgetLocale,
                        templatesObject: self.templatesObjectthirdLevelMap
                    });
                    
                    self.childs.insightMapDetails = new InsightMapDetailsSection({
                        parent: self,
                        insightLocale: self.insightEntity.widgetLocale,
                        templatesObject: self.templatesObject
                    });
                }
                else {
                    self.childs.insightMapDetails = new InsightMapDetailsSection({
                        parent: self,
                        insightLocale: self.insightEntity.widgetLocale,
                        templatesObject: self.templatesObject
                    });
                }
            },
            initListeners: function() {
                var self = this;

                if (self.poll) {
                    self.onPollReceived(self.poll);
                }

                self.listenTo(self.parent, 'pollReceived', function(poll) {
                        self.onPollReceived(poll);
                });
                self.listenTo(self.countriesVotesCollection, 'collectionIsSet', function() {
                    self.countriesVotesCollection.setSidesCollection(self.sidesCollection);
                });
                self.listenTo(self.regionVotesCollection, 'collectionIsSet', function() {
                    self.regionVotesCollection.setSidesCollection(self.sidesCollection);
                });
                self.listenToOnce(self, 'renderThirdLevelMap', function(options) {
                    self.initThirdLevelMap();
                    self.trigger('renderThirdLevelMap', options);
                });
            },
            initThirdLevelMap: function() {
                var self = this;

                self.childs.thirdLevelMap = new InsightThirdLevelMap({
                    parent: self,
                    templatesObject: self.templatesObject
                });
                self.initAdditionalListeners();
            },
            initAdditionalListeners: function() {
                var self = this,
                    region = $.i18n.mProp(self.insightEntity.widgetLocale, 'ui.overall.insight-map-details.label.region'),
                    subRegion = $.i18n.mProp(self.insightEntity.widgetLocale, 'ui.overall.insight-map-details.label.sub_region');

                self.listenTo(self.childs.thirdLevelMap, 'hidePreviousMapLevel', function() {
                    self.$(self.selectors.detailsSection).hide();
                });
                self.listenTo(self.childs.thirdLevelMap, 'renderDetailsVoteTable', function(locationData) {
                    var thirdLevelVotesCollection = new InsightCountriesPollVotesCollection();

                    thirdLevelVotesCollection.set(locationData);
                    thirdLevelVotesCollection.setSidesCollection(self.sidesCollection);
                    self.trigger('renderDetailsVoteTable', { collection: thirdLevelVotesCollection, region: subRegion });
                });
                self.listenTo(self.childs.thirdLevelMap, 'showCountryRegionMap', function() {
                    self.$(self.selectors.detailsSection).show();
                    self.trigger('renderDetailsVoteTable', { collection: self.regionVotesCollection, region: region });
                });
            },
            onPollReceived: function(poll) {
                var self = this;
                self.showSectionLoader();

                $.when(self.d_getVotes).then(function(countriesVotes){
                    self.sidesCollection.set(poll.sides);
                    self.poll = poll;
                    self.pollId = poll.id;

                    self.beforeDrawChart();
                    self.onCountriesVotesReceived(countriesVotes);
                });
            },
            beforeDrawChart: function() {
                var self = this;

                self.render();
                self.initChilds();
                self.trigger('renderMobileDetailsVoteTable', self.poll);
                self.parent.trigger('viewReady', self);
                self.parent.trigger(self.sectionName + 'Ready');
            },
            onRender: function() {
                var self = this;

                self.renderView();
            },
            onCountriesVotesReceived: function(countriesVotes) {
                var self = this;

                self.countriesVotesCollection.reset([], { silent: true });
                self.countriesVotesCollection.set(countriesVotes);

                if ( self.countriesVotesCollection.defaultCodeCountryToZoom ) {
                    self.onDrawGeoChartRegions(self.countriesVotesCollection.defaultCodeCountryToZoom);
                }
                else {
                    $.when(self.GeoChart).then(function() {
                        self.drawGeoChartCountries();
                        self.hideSectionLoader();
                    });
                }
            },
            renderView: function() {
                var self = this;

                self.$el.html(self.getTemplate(self.templates.viewBlock, self.templatesObject, {
                    sidesCollection: self.sidesCollection,
                    insightLocale: self.insightEntity.widgetLocale,
                    sectionColor: self.insightEntity.sectionColor
                }));
            },
            drawGeoChartCountries: function() {
                var self = this,
                    dataTable = new google.visualization.DataTable(),
                    dataRows = [],
                    chartOptions = {},
                    $container = self.$(self.selectors.mapMainContainer)[0],
                    chart = new google.visualization.GeoChart($container),
                    sidesCollection = self.sidesCollection.clone(),
                    axisCollection = GeoChartHelper.prepareAxisCollection(sidesCollection, self.countriesVotesCollection),
                    region = $.i18n.mProp(self.insightEntity.widgetLocale, 'ui.overall.insight-map-details.label.country');

                self.trigger('renderDetailsVoteTable', { collection: self.countriesVotesCollection, region: region });
                self.$(self.selectors.detailsSection).hide();
                self.$(self.selectors.mainSection).show();

                self.prepareDataTableColumn(dataTable);
                dataRows = self.getPreparedChartRowData(self.countriesVotesCollection, sidesCollection, axisCollection);
                dataTable.addRows(dataRows);

                chartOptions = $.extend({
                    legend: 'none',
                    displayMode: 'regions',
                    colorAxis: {
                        colors: axisCollection.getColorsArray()
                    }
                }, self.geoChartDefaults);

                google.visualization.events.addListener(chart, 'select', function() {
                    var countryCode = self.getCountryCode(chart, dataTable, 'drawGeoChartRegions');

                    self.onDrawGeoChartRegions(countryCode);
                });

                chart.draw(dataTable, chartOptions);
            },
            onDrawGeoChartRegions: function(countryCode) {
                var self = this,
                    requestData = {
                        pollId: self.poll.id,
                        countryCode: countryCode
                    };

                self.showSectionLoader();
                $.when(self.loadVotes(requestData)).then(function(regionVotes) {
                    self.hideSectionLoader();

                    self.regionVotesCollection.reset([], { silent: true });
                    self.regionVotesCollection.set(regionVotes);

                    $.when(self.GeoChart).then(function() {
                        self.drawGeoChartRegions(countryCode);
                    });
                }, function(XHttpRequest, message) {
                    self.hideSectionLoader();
                    alert(message);
                });
            },
            drawGeoChartRegions: function(countryCode) {
                var self = this,
                    $container = self.$(self.selectors.mapDetailsContainer)[0],
                    chart = new google.visualization.GeoChart($container),
                    dataTable = new google.visualization.DataTable(),
                    dataRows = [],
                    chartOptions = {},
                    sidesCollection = self.sidesCollection.clone(),
                    axisCollection = GeoChartHelper.prepareAxisCollection(sidesCollection, self.regionVotesCollection),
                    region = $.i18n.mProp(self.insightEntity.widgetLocale, 'ui.overall.insight-map-details.label.region'),
                    subRegion = $.i18n.mProp(self.insightEntity.widgetLocale, 'ui.overall.insight-map-details.label.sub_region'),
                    selectedCountryCode;

                self.trigger('renderDetailsVoteTable', { collection: self.regionVotesCollection, region: region });
                self.$(self.selectors.detailsSection).show();
                self.$(self.selectors.mainSection).hide();

                self.prepareDataTableColumn(dataTable);
                dataRows = self.getPreparedChartRowData(self.regionVotesCollection, sidesCollection, axisCollection);
                dataTable.addRows(dataRows);

                chartOptions = $.extend({
                    displayMode: 'regions',
                    resolution: 'provinces',
                    colorAxis: {
                        colors: axisCollection.getColorsArray()
                    },
                    region: countryCode,
                    legend: 'none'
                }, self.geoChartDefaults);

                google.visualization.events.addListener(chart, 'select', function() {
                    selectedCountryCode = self.getCountryCode(chart, dataTable, 'thirdLevelMap') || selectedCountryCode;

                    self.trigger('renderThirdLevelMap', {
                        regionCode: selectedCountryCode,
                        mapSubregionMode: self.poll.mapSubregionMode
                    });
                    self.trigger('renderDetailsVoteTable', { collection: self.regionVotesCollection, region: subRegion });
                });

                chart.draw(dataTable, chartOptions);
            },
            getPreparedChartRowData: function(areasVotes, sidesCollection, axisCollection) {
                var self = this,
                    dataRows = [];

                areasVotes.each(function(area) {
                    var maxVotedSideId = GeoChartHelper.getMaxVotedSideId(area.get('sidesVotes')),
                        toolTip = self.getTemplate(self.templates.mapTooltip, self.templatesObject, {
                            regionVotesById: area.get('sideById')
                        });

                    dataRows.push([
                        {
                            v: area.get('regionCode'),
                            f: area.get('regionName')
                        },
                        axisCollection.indexOf(axisCollection.get(maxVotedSideId)) + 1,
                        toolTip
                    ]);
                });

                return dataRows;
            },
            getCountryCode: function(chart, dataTable, mode) {
                var self = this,
                    selection = chart.getSelection(),
                    countryCode = null,
                    item;

                if ( mode !== 'thirdLevelMap' ) {
                    item = selection[0];
                    countryCode = dataTable.getValue(item.row, 0);
                }
                else {
                    if ( !_.isEmpty(selection) ) {
                        item = selection[0];
                        countryCode = dataTable.getValue(item.row, 0); 
                    }
                }

                return countryCode;
            },
            prepareDataTableColumn: function(dataTable) {
                dataTable.addColumn('string', 'Country');
                dataTable.addColumn('number', 'Value');
                dataTable.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
            },
            loadVotes: function(requestData) {
                var self = this;

                return self.ajax({
                    url: self.api.getVotesByLocation,
                    showLoader: false,
                    type: 'POST',
                    dataType: 'json',
                    data: requestData
                });
            }
        });

        return InsightMapSection;
    }
);