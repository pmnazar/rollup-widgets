define(
    'insight-third-level-map',
    [
        'app',
        'default',
        'helpers/settings/side-colors',
        'helpers/maps/d3-lib-loader'
    ],
    function(App, DefaultView, SideColors, d3Init) {
        var InsightThirdLevelMap = DefaultView.extend({
            el: '#region-detailed-map',
            mapEl: '#third-level-map',
            template: {
                thirdLevelMapContainer: 'thirdLevelMapContainer',
                thirdLevelMapContainerForWidget: 'thirdLevelMapContaineWidget',
                tooltipTpl: 'tooltip'
            },
            api: {
                mapgetGeoJson: App.config.URL_SERVER + 'MapGetGeoJson',
                apiNameForData: App.config.URL_SERVER + 'PollFindVotesMapByLocation'
            },
            selectors: {
                backToStates: '#back-to-states',
                backButton: '#back-button',
                mapDetails: '#map-details'
            },
            d3Srs: [
                'cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js',
                'cdnjs.cloudflare.com/ajax/libs/d3-tip/0.6.3/d3-tip.min.js',
                'cdnjs.cloudflare.com/ajax/libs/topojson/1.6.20/topojson.min.js'
            ],
            isWidget: false,
            repoType: null,
            admCode: '',
            countryCode: '',
            enabledThirdLevelMap: true,
            selectedCountryGeoData: null,
            enabledFor: ['US'],
            defaultRegionColor: '#F5F5F5',
            defaultStrokeColor: '#DDDDDD', 
            lastTooltip: {},
            mapGeoJson: {},
            locationData: {},
            sidesCollection: {},
            apiDataInputParams: {},
            d_d3Lib: {},
            sidesCollor: SideColors,
            mergeDataStatus: $.Deferred(),
            notifications: {
                noRegionData: 'No data for this region'
            },
            events: {
                'click .js-change-region-type': 'changeRegionType',
                'click #show-region-button': 'showCountryRegionMap',
                'click #back-to-states': 'mapSwitcher' //NOTE: for widget
            },
            onInitialize: function() {
                var self = this;

                self.d_d3Lib = d3Init(self.d3Srs);
                self.$el.hide();
                self.initListeners();
            },
            initListeners: function() {
                var self = this;

                self.listenTo(self.parent, 'renderThirdLevelMap', function(geoData) {
                    self.onRegionCodeReceived(geoData);
                });
                self.listenTo(self, 'hidePreviousMapLevel', function() {
                    self.trigger('renderDetailsVoteTable', self.locationData);
                });
            },
            onRegionCodeReceived: function(geoData) {
                var self = this;

                if ( self.enabledThirdLevelMap ) {
                    self.repoType = geoData.mapSubregionMode;
                    self.extractRegionCode(geoData.regionCode);
                    self.sidesCollection = self.parent.sidesCollection.clone();
                }
            },
            setRequestObjectParams: function() {
                var self = this;

                self.apiDataInputParams = {
                    pollId: self.parent.poll.id,
                    countryCode: self.countryCode,
                    adm1Code: self.admCode,
                    adm2Type: self.repoType
                };
            },
            showCountryRegionMap: function() {
                var self = this;

                self.$el.hide();
                self.hideTooltips();
                self.trigger('showCountryRegionMap');
            },
            changeRegionType: function(e) {
                var self = this;

                self.hideTooltips();
                self.repoType = self.$(e.currentTarget).data('type');
                self.setRequestObjectParams();
                self.sendDataAndPolygonRequest(self.selectedCountryGeoData);
            },
            extractRegionCode: function(geoData) {
                var self = this,
                    selectedCountryGeoData = geoData.split('-'),
                    countryCode = selectedCountryGeoData[0];

                self.selectedCountryGeoData = selectedCountryGeoData;
                self.countryCode = countryCode;
                self.admCode = geoData;

                if ( _.indexOf(self.enabledFor, countryCode) !== -1 ) {
                    self.setRequestObjectParams();
                    self.sendDataAndPolygonRequest(selectedCountryGeoData);
                }
            },
            sendDataAndPolygonRequest: function(selectedCountryGeoData) {
                var self = this;

                self.showSectionLoader();
                self.setWidgetSizeProp();

                $.when(self.getGeoJson(selectedCountryGeoData), self.getDataForLocation()).done(function(geoData, dataLocation) {
                    self.mapGeoJson = geoData;
                    self.locationData = dataLocation;
                    if (!_.isEmpty(self.mapGeoJson)) {
                        self.mergeDataWithPolygons();

                        $.when(self.mergeDataStatus).done(function() {
                            self.renderMapContainer();
                            $.when(self.d_d3Lib).then(function() {
                                self.convertPoligonsIntoMap();
                            });
                        });
                    }
                    else {
                        self.hideSectionLoader();
                        alert(self.notifications.noRegionData);
                    }
                });
            },
            setWidgetSizeProp: function() {
                var self = this;

                self.mapWidth  = self.parent.$el.find('svg').attr('width');
                self.mapHeight = self.parent.$el.find('svg').attr('height');
            },
            getGeoJson: function(selectedCountryGeoData) {  
                var self = this,
                    country = selectedCountryGeoData[0],
                    state = selectedCountryGeoData[1];   

                return self.ajax({
                    url: self.api.mapgetGeoJson,
                    showLoader: false,
                    dataType: 'json',
                    type: 'POST',
                    data: {
                        repoType: self.repoType,
                        country: country,
                        state: state
                    },
                });
            },
            getDataForLocation: function() {
                var self = this;

                return self.ajax({
                    url: self.api.apiNameForData,
                    showLoader: false,
                    type: 'POST',
                    dataType: 'json',
                    data: self.apiDataInputParams,
                });
            },
            mergeDataWithPolygons: function() {
                var self = this;

                $.each(self.locationData, function(indexLoc, propOfLoc) {
                    var countVotes = 0,
                        counter = 0;

                    $.each(self.mapGeoJson.features, function(indexGeoJson, propGeoJson) {
                        $.each(propOfLoc.sidesVotes, function(indexVote, valueVote) {
                            if (propOfLoc.regionCode === propGeoJson.id) {
                                countVotes += valueVote;
                                propGeoJson['votesCount'] = countVotes;
                            }
                        }); 
                        if (propOfLoc.regionCode === propGeoJson.id) {

                            propGeoJson['votes'] = [];
                            $.each(self.sidesCollection.models, function(indexVote, sideModel) {
                                propGeoJson.votes.push({
                                    voteLabel: sideModel.get('answer'),
                                    sideColor: (function() {
                                        var sideColor;

                                        sideColor = self.sidesCollor[counter];
                                        counter++;

                                        return sideColor;
                                    }()),
                                    voteCount: (function() {
                                        var percent;

                                        _.find(propOfLoc.sidesVotes, function(voteCount, voteId) {
                                            if (parseInt(voteId) === sideModel.get('id')) {
                                                 percent = (voteCount / propGeoJson.votesCount) * 100;
                                            }
                                        });

                                        if (percent === undefined) {
                                            percent = 0;
                                        }

                                        return percent === 0 ? percent : percent.toFixed(1);
                                    }())
                                });
                            });
                        }
                    });
                });

                return self.mergeDataStatus.resolve();
            },
            renderMapContainer: function() {
                var self = this;

                self.trigger('hidePreviousMapLevel');

                if ( self.isWidget ) {
                    self.$el.html(self.getTemplate(self.template.thirdLevelMapContainerForWidget, self.templatesObject, {
                        mapType: self.repoType,
                        insightLocale: self.parent.insightEntity.widgetLocale
                    }));

                    self.$(self.selectors.backToStates).show();
                }
                else {
                    self.$el.html(self.getTemplate(self.template.thirdLevelMapContainer, self.templatesObject, {
                        mapType: self.repoType,
                        insightLocale: self.parent.insightEntity.widgetLocale
                    }));
                }
                self.$el.show();
                self.hideSectionLoader();
            },
            convertPoligonsIntoMap: function() {
                var self = this,
                    tip,
                    svgContainer,
                    tipContentObject = {};

                tip = d3.tip().attr('class', 'd3-tip').html(function(selected) {
                    return self.getTemplate(self.template.tooltipTpl, self.templatesObject, {
                        selectedObject: selected,
                        insightLocale: self.parent.insightEntity.widgetLocale
                    });
                }).direction('e').offset([-10, 6]);

                svgContainer = d3.select(self.mapEl)
                                       .append('svg')
                                       .attr('width', self.mapWidth)
                                       .attr('height', self.mapHeight);

                var center     = d3.geo.centroid(self.mapGeoJson),
                    scale      = 160,
                    offset     = [self.mapWidth / 2, self.mapHeight / 2],
                    projection = d3.geo.mercator().scale(scale)
                                                  .center(center)
                                                  .translate(offset);

                var path   = d3.geo.path().projection(projection),
                    bounds = path.bounds(self.mapGeoJson),
                    hscale = scale * self.mapWidth  / (bounds[1][0] - bounds[0][0]),
                    vscale = scale * self.mapHeight / (bounds[1][1] - bounds[0][1]),
                    scale  = (hscale < vscale) ? hscale : vscale,
                    offset = [self.mapWidth - (bounds[0][0] + bounds[1][0])/2, self.mapHeight - (bounds[0][1] + bounds[1][1])/2];

                projection = d3.geo.mercator().center(center)
                                              .scale(scale)
                                              .translate(offset);

                path = path.projection(projection);
                svgContainer.call(tip);

                svgContainer.selectAll('path')
                                .data(self.mapGeoJson.features)
                                .enter()
                                .append('path')
                                .attr('d', path)
                                .style('fill',function(featuresProp) {
                                var regionColor = self.defaultRegionColor,
                                    findMaxVoteCount;

                                if (!_.isEmpty(featuresProp.votes)) {
                                    findMaxVoteCount = _.max(featuresProp.votes, function(vote){ 
                                        return parseInt(vote.voteCount);
                                    });
                                    regionColor = findMaxVoteCount.sideColor;
                                }

                                    return regionColor;     
                                })
                                .style('stroke-width', '1')
                                .style('stroke', self.defaultStrokeColor)
                                .on('mouseover', function(d) {
                                    d3.select(this.parentNode.appendChild(this)).transition().duration(100)
                                    .style({ 'stroke-width': 1.5, 'stroke-opacity': 1, 'stroke':'#BDBDBD' });
                                    tip.show(d);

                                    self.lastTooltip = {
                                        self: this,
                                        tip: tip,
                                        d3evnt: d
                                    };
                                })
                                .on('mouseout', function(d) {
                                    d3.select(this.parentNode.appendChild(this)).transition().duration(100)
                                    .style({ 'stroke-width': 1, 'stroke-opacity': 1, 'stroke': self.defaultStrokeColor });
                                    tip.hide(d);
                                });
            },
            hideTooltips: function() {
                var self = this;

                if ( !_.isEmpty(self.lastTooltip.self) ) {
                    $.when(self.d_d3Lib).then(function() {
                        d3.select((self.lastTooltip.self).parentNode.appendChild((self.lastTooltip.self))).transition().duration(100)
                        .style({ 'stroke-width': 1, 'stroke-opacity': 1, 'stroke': self.defaultStrokeColor });
                        self.lastTooltip.tip.hide((self.lastTooltip.d3evnt));
                        self.lastTooltip = {};
                    });
                }
            },
            mapSwitcher: function() {
                var self = this,
                    $backButton = self.parent.$(self.selectors.backButton);

                self.$el.hide();
                self.hideTooltips();
                self.parent.$(self.selectors.mapDetails).show();

                if ( $backButton.length ) {
                    $backButton.show();
                }
            }
        });

        return InsightThirdLevelMap;
    }
);