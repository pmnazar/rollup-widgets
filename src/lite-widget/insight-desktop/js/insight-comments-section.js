define(
    'insight-comments-section',
    [
        'default'
    ],
    function (DefaultView) {
        var InsightCommentSection = DefaultView.extend({
            el: '.js-comments-section',
            templates: {
                section: 'tplInsightCommentsSection',
                script: 'tplInsightCommentsSectionScript'
            },
            sectionColor: '',
            insightLocale: '',
            pollId: null,
            onInitialize: function() {
                var self = this;

                self.initListeners();
                self.render();
            },
            initListeners: function() {
                var self = this;

                self.listenTo(self.parent, 'pollReceived', function(poll) {
                    self.onPollReceived(poll);
                });
            },
            onPollReceived: function(poll) {
                var self = this;
                
                self.showSectionLoader();
                self.pollId = poll.id;
                self.render();
            },
            onRender: function() {
                var self = this;

                self.$el.html(self.getTemplate(self.templates.section, self.templatesObject, {
                    sectionColor: self.sectionColor,
                    insightLocale: self.insightLocale,
                    pollId: self.pollId
                }));

                self.loadScript();

                self.parent.trigger('viewReady', self);
                self.parent.trigger(self.sectionName + 'Ready');
                self.hideSectionLoader();
            },
            loadScript: function() {
                var self = this;

                $('head').append(self.getTemplate(self.templates.script, self.templatesObject)); 
            }
        });

        return InsightCommentSection;
    }
);