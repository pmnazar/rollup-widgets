define(
    'insight-poll-stats-section',
    [
        'default',
        'insight-poll-stats-by-category-controls',
        'insight-true-identity-section',
        'insight-profile-update-section'
    ],
    function (DefaultView, PollStatsByCategoryControls, InsightTrueIdentitySection, ProfileUpdateSection) {
        var InsightPollStatsSection = DefaultView.extend({
            el: '.js-poll-stats-section',
            templates: {
                pollStatsContainer: 'tplPollStatsSectionContainer',
                pollStatsContent: 'tplPollStatsSection'
            },
            selectors: {
                statsContentSelector: '.js-poll-stats-content'
            },
            insightLocale: '',
            childs: {},
            onInitialize: function() {
                var self = this;

                self.render();
                self.initListeners();
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
            onRender: function() {
                var self = this;

                self.$el.html(self.getTemplate(self.templates.pollStatsContainer, self.templatesObject));
                self.parent.trigger('viewReady', self);
                self.parent.trigger(self.sectionName + 'Ready');
            },
            initChilds: function() {
                var self = this;

                self.childs.ProfileUpdateSection = new ProfileUpdateSection({
                    parent: self,
                    insightLocale: self.insightLocale,
                    templatesObject: self.templatesObject
                });

                self.childs.pollStatsByCategoryControls = new PollStatsByCategoryControls({
                    parent: self,
                    pollId: self.pollId,
                    pollSides: self.poll.sides,
                    insightLocale: self.insightLocale,
                    templatesObject: self.templatesObject
                });

                self.childs.InsightTrueIdentitySection = new InsightTrueIdentitySection({
                    poll: self.poll,
                    pollId: self.pollId,
                    insightLocale: self.insightLocale,
                    templatesObject: self.templatesObject
                });
            },
            onPollReceived: function(poll) {
                var self = this;

                self.poll = poll;
                self.pollId = poll.id;
                self.renderContent();
                self.removeChilds();
                self.initChilds();
                self.parent.trigger(self.sectionName  + 'Ready');
                self.hideSectionLoader();
            },
            renderContent: function() {
                var self = this;

                self.$(self.selectors.statsContentSelector).html(self.getTemplate(self.templates.pollStatsContent, self.templatesObject, {
                    totalVotes: self.poll.totalVotes,
                    insightLocale: self.insightLocale,
                    sectionColor: self.sectionColor
                }));
            },
            removeChilds: function() {
                var self = this;

                if (!_.isEmpty(self.childs) && self.childs.ProfileUpdateSection && self.childs.pollStatsByCategoryControls && self.childs.InsightTrueIdentitySection) {
                    self.childs.ProfileUpdateSection.removeView();
                    self.childs.pollStatsByCategoryControls.removeView();
                    self.childs.InsightTrueIdentitySection.removeView();
                }
            }
        });

        return InsightPollStatsSection;
    }
);