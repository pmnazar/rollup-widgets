define(
    'insight-compare-contrast-section',
    [
        'app',
        'default',
        'collections/insight-poll-sides-collection',
        'collections/insight-compare-contrast-collection'
    ],
    function (App, DefaultView, InsightPollSidesCollection, InsightCompareContrastCollection) {
        var InsightCompareAndContrast = DefaultView.extend({
            el: '.js-compare-contrast-section',
            api: {
                getInsightStats: App.config.URL_SERVER + 'PollFindInsightSideVoteStats'
            },
            insightEntity: {},
            template: 'tplCompareAndContrast',
            selectors: {
                // thisSiteTotalVotes: '.js-total-this-site',
                // otherSitesTotalVotes: '.js-total-other-site',
                thisSiteBySideBase: '.js-this-site-side-',
                otherSitesBySideBase: '.js-other-sites-side-',
                thisSiteProgresBySideBase: '.js-progres-this-side-',
                otherSiteProgresBySideBase: '.js-progres-other-side-'
            },
            onInitialize: function() {
                var self = this;

                self.initCollection();
                self.initListeners();
            },
            initCollection: function() {
                var self = this;

                self.sidesCollection = new InsightPollSidesCollection();
                self.compareContrastCollection = new InsightCompareContrastCollection();
            },
            initListeners: function() {
                var self = this;

                if (self.poll) {
                    self.onPollReceived(self.poll);
                }
                self.listenTo(self.parent, 'pollReceived', function(poll) {
                    self.onPollReceived(poll);
                });
            },
            onPollReceived: function(poll) {
                var self = this;

                self.poll = poll;
                self.pollId = poll.id;
                self.sidesCollection.set(poll.sides);
                self.render();

                $.when(self.getInsightStats()).then(function(insightStats) {
                    self.compareContrastCollection.set(insightStats);
                    // self.renderTotalStats();
                    self.renderDetailedStats();
                    self.parent.trigger('viewReady', self);
                    self.parent.trigger(self.sectionName + 'Ready');
                    self.hideSectionLoader();
                }, function(XHttpRequest, message) {
                    self.hideSectionLoader();
                    alert(message);
                });
            },
            onRender: function() {
                var self = this;

                self.$el.html(self.getTemplate(self.template, self.templatesObject, {
                    sidesCollection: self.sidesCollection,
                    insightLocale: self.insightEntity.widgetLocale,
                    sectionColor: self.insightEntity.sectionColor,
                    votedForSide: self.poll.votedForSide,
                    // thisSiteVotesBySideId: self.compareContrastCollection.getSidesVotes('partnerVotes'),
                    // otherSiteVotesBySideId: self.compareContrastCollection.getSidesVotes('otherVotes')
                }));
            },
            // renderTotalStats: function() {
                // var self = this;

                // self.$(self.selectors.thisSiteTotalVotes).html(self.compareContrastCollection.getTotal('partnerVotes').total);
                // self.$(self.selectors.otherSitesTotalVotes).html(self.compareContrastCollection.getTotal('otherVotes').total);
            // },
            renderDetailedStats: function() {
                var self = this,
                    thisSiteVotesBySideId = self.compareContrastCollection.getSidesVotes('partnerVotes'),
                    otherSiteVotesBySideId = self.compareContrastCollection.getSidesVotes('otherVotes');

                $.each(thisSiteVotesBySideId, function(id, votes) {
                    self.$(self.selectors.thisSiteBySideBase + id + '-votes').html(votes);
                    self.$(self.selectors.thisSiteProgresBySideBase + id).css('width', thisSiteVotesBySideId[id]);
                });
                $.each(otherSiteVotesBySideId, function(id, votes) {
                    self.$(self.selectors.otherSitesBySideBase + id + '-votes').html(votes);
                    self.$(self.selectors.otherSiteProgresBySideBase + id).css('width', otherSiteVotesBySideId[id]);
                });
            },
            getInsightStats: function() {
                var self = this;

                return self.ajax({
                    url: self.api.getInsightStats,
                    showLoader: false,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        partnerExternalId: self.insightEntity.partner,
                        pollId: self.pollId
                    }
                });
            }
        });

        return InsightCompareAndContrast;
    }
);