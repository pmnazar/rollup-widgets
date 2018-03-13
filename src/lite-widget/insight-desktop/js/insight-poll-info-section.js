define(
    'insight-poll-info-section',
    [
        'app',
        'default',
        'helpers/statistic/to-friendly-number',
        'helpers/statistic/separate-each-1K',
        'helpers/mini-loader',
        'collections/insight-poll-info-collection'
    ],
    function (App, DefaultView, ToFriendlyNumber, SeparateEach1K, MiniLoader, InsightPollInfoCollection) {
        var InsightPollInfoSection = DefaultView.extend({
            el: '.js-poll-info-section',
            templates: {
                main: 'tplPollInfoSection',
                pollSection: 'tplPollSection',
                prevNextPolls: 'tplPollPrevNext',
                pollStickyHeaderImg: 'tplInsightImgSection',
                pollStickyHeaderTagLine: 'tplInsightPollStatsTagLine',
                dashboardBtn: 'tplDashBoardBtn'
            },
            selectors: {
                pollStickyHeaderImg: '.js-img-box-poll-info',
                pollStickyHeaderTagLine: '.js-i-poll-s-tagline',
                dashboardBtn: '.js-dashboard-btn',
                prevArrow: '.js-prev-poll',
                nextArrow: '.js-next-poll',
                truncateText: '.js-truncate'
            },
            sidesCollection: {},
            api: {
                voteForSide: App.config.URL_SERVER_API_NEW + 'poll-vote/poll-side/',
                getUserPermissions: App.config.URL_SERVER_API_NEW + 'account',
                widgetCanManage: App.config.URL_SERVER + 'WidgetCanManage'
            },
            defaultPollImgPath: App.config.PATH_IMG + 'ui/overall/quiz-resuts/default-quiz.png',// fix it later
            adminDashboardURLBase: App.config.DOMAIN_URL + '#!/admin/partners/dashboard/',
            partnerDashboardURL: App.config.DOMAIN_URL + '#!/partner/dashboard/summary',
            insightBaseURL: App.config.DOMAIN_URL + 'insight.html#!/',
            poll: {},
            pollPrevNext: [],
            dashboardRedirectUrl: '',
            insightLocale: '',
            sectionColor: '',
            partnerExternalId: '',
            statsFormat: 'toFriendlyNumber',
            precision: 1,
            pollRendered: false,
            prevNextPollsRendered: false,
            events: {
                'click .js-vote-this-side:not([checked="checked"])': 'voteForSide'
            },
            onInitialize: function() {
                var self = this;

                self.initCollections();
                self.initListeners();
                self.render();
                MiniLoader.show('.poll-section');

                self.resizeEvent = window.addEventListener('resize', _.debounce(function() {
                     self.onWindowResize();
                }, 400), false);
            },
            initCollections: function() {
                var self = this;

                self.sidesCollection = new InsightPollInfoCollection();
            },
            initListeners: function() {
                var self = this;

                self.listenTo(self.parent, 'pollReceived', function(poll) {
                    self.onPollReceived(poll);
                });
                self.listenTo(self.sidesCollection, 'votesUpdated', function() {
                    self.onVotesUpdated();
                });
                self.listenTo(self.parent, 'pollPrevNextReceived', function(pollPrevNext) {
                    self.onPollPrevNextReceived(pollPrevNext);
                });
            },
            onPollReceived: function(poll) {
                var self = this;

                self.sidesCollection.set(poll.sides);
                self.poll = poll;

                self.renderPollStats();
                MiniLoader.hide('.poll-section');

                self.parent.trigger(self.sectionName + 'Ready');
                self.renderAdminPartnerDashbordButton();
            },
            onPollPrevNextReceived: function(pollPrevNext) {
                var self = this;

                self.pollPrevNext = pollPrevNext;
                self.renderPrevNextPolls();
            },
            onVotesUpdated: function() {
                var self = this;

                self.poll.votedForSide = self.sidesCollection.lastVotedSide;
                self.renderPollStats();
                self.renderPrevNextPolls();

                self.parent.trigger('viewReady', self);
                self.parent.trigger('voteUpdated');

                self.setNextPrevUrls();
                self.renderDashboardButton();
            },
            renderAdditionalData: function() {
                var self = this,
                    pollIcon = self.poll.icon || self.defaultPollImgPath;

                $(self.selectors.pollStickyHeaderImg).html(self.getTemplate(self.templates.pollStickyHeaderImg, self.templatesObject, {
                    pollIcon: pollIcon
                }));
                $(self.selectors.pollStickyHeaderTagLine).html(self.getTemplate(self.templates.pollStickyHeaderTagLine, self.templatesObject, {
                    tagline: self.poll.tagLine
                }));
            },
            renderPollContainer: function() {
                var self = this;

                self.$el.html(self.getTemplate(self.templates.main, self.templatesObject, {}));

                self.truncateText();
            },
            renderPollStats: function() {
                var self = this,
                    pollIcon = self.poll.icon || self.defaultPollImgPath,
                    allowVoting = self.poll.status === 'published',
                    isClosedPoll = self.poll.status !== 'published';

                 self.$el.find('.poll-section').html(self.getTemplate(self.templates.pollSection, self.templatesObject, {
                    pollIcon: pollIcon,
                    tagLine: self.poll.tagLine,
                    totalViews: self.formatStats(self.poll.totalViews),
                    totalVotes: self.formatStats(self.sidesCollection.totalVotes),
                    sidesCollection: self.sidesCollection,
                    votedForSide: self.poll.votedForSide,
                    insightLocale: self.insightLocale,
                    sectionColor: self.sectionColor,
                    allowVoting: allowVoting,
                    isClosedPoll: isClosedPoll
                }));

                self.renderAdditionalData();
                self.pollRendered = true;

                if (self.pollRendered && self.prevNextPollsRendered) {
                    self.parent.trigger('viewReady', self);
                    self.truncateText();
                }
            },
            renderPrevNextPolls: function() {
                var self = this,
                    prevPollTagline = self.pollPrevNext[0] && self.pollPrevNext[0].tagline ? self.pollPrevNext[0].tagline : '',
                    nextPollTagline = self.pollPrevNext[1] && self.pollPrevNext[1].tagline ? self.pollPrevNext[1].tagline : '';

                 self.$el.find('.next-prev').html(self.getTemplate(self.templates.prevNextPolls, self.templatesObject, {
                    prevPollTagline: prevPollTagline,
                    nextPollTagline: nextPollTagline,
                    insightLocale: self.insightLocale,
                }));

                self.setNextPrevUrls();
                self.prevNextPollsRendered = true;

                if (self.pollRendered && self.prevNextPollsRendered) {
                    self.parent.trigger('viewReady', self);
                    self.truncateText();
                }
            },
            onWindowResize: function() {
                var self = this;

                self.truncateText();
            },
            truncateText: function() {
                var self = this,
                    elements = self.$(self.selectors.truncateText),
                    fullText;

                _.forEach(elements, function(el) {
                    fullText = el.getAttribute('title');

                    self.truncate(fullText, el);
                }, self);
            },
            truncate: function(text, el) {
                var words = text.split(' '),
                    suffix = '...',
                    lineHeight = parseInt($(el).css('line-height'));

                el.innerHTML = text;

                while (Math.round(el.scrollHeight / lineHeight) > Math.round(el.offsetHeight / lineHeight)) {
                    words.pop();
                    text = words.join(' ');

                    el.innerHTML = text + suffix;
                }
            },
            onRender: function() {
                var self = this;

                self.renderPollContainer();
            },
            renderAdminPartnerDashbordButton: function() {
                var self = this;

                $.when(self.getUserPermissions()).then(function(account) {
                    if ( account.roles.indexOf('admin') !== -1 ) {
                        self.dashboardRedirectUrl = self.adminDashboardURLBase + self.partnerExternalId;
                        self.renderDashboardButton();
                    }
                    else if ( account.roles.indexOf('partner') !== -1 ) {
                        $.when(self.widgetCanManage()).then(function(canManage) {
                            if ( canManage ) {
                                self.dashboardRedirectUrl = self.partnerDashboardURL;
                                self.renderDashboardButton();
                            }
                        });
                    }
                });
            },
            renderDashboardButton: function() {
                var self = this;

                if ( self.dashboardRedirectUrl ) {
                    self.$(self.selectors.dashboardBtn).html(self.getTemplate(self.templates.dashboardBtn, self.templatesObject, {
                        dashboardLink: self.dashboardRedirectUrl,
                        insightLocale: self.insightLocale
                    }));
                }
            },
            setNextPrevUrls: function() {
                var self = this,
                    $prevArrow = $(self.selectors.prevArrow),
                    $nextArrow = $(self.selectors.nextArrow),
                    pollPrevId = self.pollPrevNext[0] && self.pollPrevNext[0].id ? self.pollPrevNext[0].id : '',
                    pollNextId = self.pollPrevNext[1] && self.pollPrevNext[1].id ? self.pollPrevNext[1].id : '',
                    prevPollUrl = self.insightBaseURL + pollPrevId + '/' + self.widgetId + '/' + self.insightLocale,// hardcode
                    nextPollUrl = self.insightBaseURL + pollNextId + '/' + self.widgetId + '/' + self.insightLocale;// hardcode

                    if ( self.pollPrevNext.length === 2 && self.pollPrevNext[0].id !== self.pollPrevNext[1].id ) {
                        $prevArrow.each(function() {
                            $(this).off();
                            $(this).find('a').attr('href', prevPollUrl);
                            $(this).attr('href', prevPollUrl).removeClass('hide').on('click', function() {
                                self.trackPollRotation(pollPrevId);
                            });
                        });
                        $nextArrow.each(function() {
                            $(this).off();
                            $(this).find('a').attr('href', nextPollUrl);
                            $(this).attr('href', nextPollUrl).removeClass('hide').on('click', function() {
                                self.trackPollRotation(pollNextId);
                            });
                        });
                    }
            },
            trackPollRotation: function(pollId) {
                var self = this;

                self.showSectionLoader();
                self.parent.trigger('trackEvent', 'insight_poll_rotation_click');
                self.parent.trigger('pollChanged', pollId);
            },
            formatStats: function(value, mode) {
                var self = this,
                    result,
                    formatBy = {
                        'each1K': function(number) {
                            return SeparateEach1K(number);
                        },
                        'toFriendlyNumber': function(number) {
                            return ToFriendlyNumber(number, self.precision);
                        }
                    };

                mode = mode || self.statsFormat;

                if ( mode in formatBy ) {
                    result = formatBy[mode](value);
                }
                else {
                    result = value;
                }

                return result;
            },
            getUserPermissions: function() {
                var self = this;

                return self.ajax({
                    url: self.api.getUserPermissions,
                    showLoader: false,
                    type: 'GET',
                    dataType: 'json',
                });
            },
            widgetCanManage: function() {
                var self = this;

                return self.ajax({
                    url: self.api.widgetCanManage,
                    showLoader: false,
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        widgetCode: self.widgetId
                    }
                });
            },
            voteForSide: function(e) {
                var self = this,
                    sideId = parseInt(e.currentTarget.value);

                $.when(self.sendVote(sideId)).then(function() {
                    self.onVoteSent(sideId);
                }, function(XHttpRequest, message) {
                    // self.hideSectionLoader();
                    // alert(message);
                });
            },
            sendVote: function(sideId) {
                var self = this;

                return self.ajax({
                    url: self.api.voteForSide + sideId,
                    showLoader: false,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        sourceType: 'insight',
                        sourceCode: self.parent.insightEntity.guid
                    }
                });
            },
            onVoteSent: function(sideId) {
                var self = this;

                self.sidesCollection.voteForSide(sideId, self.poll.votedForSide);
            }
        });

        return InsightPollInfoSection;
    }
);