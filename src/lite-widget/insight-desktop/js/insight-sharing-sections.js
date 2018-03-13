define(
    'insight-sharing-sections',
    [
        'app',
        'default',
        'helpers/settings/sharings'
    ],
    function (App, DefaultView, ShDefault) {
        var InsightSharingSections = DefaultView.extend({
            template: 'tplSharingSection',
            insightBaseUrl: App.config.URL_SERVER_REST + 'sharing/insight',
            socialServiceUrls: {
                FBShareUrl: ShDefault.FBShareUrl,
                GoogleShareUrl: ShDefault.GoogleShareUrl,
                TWShareUrl: ShDefault.TWShareUrl,
                LinkedInShareUrl: ShDefault.LinkedInShareUrl,
            },
            selectors: {
                sharingSection: '.js-sharing-section'
            },
            popupSettings: ShDefault.popupSettings,
            events: {
                'click .js-fb-share-btn': 'fbShare',
                'click .js-google-share-btn': 'googleShare',
                'click .js-twitter-share-btn': 'twitterShare',
                'click .js-linked-in-share-btn': 'linkedInShare',
            },
            pollId: null,
            onInitialize: function() {
                var self = this;

                self.initListeners();
            },
            onRender: function() {
                var self = this;

                self.$(self.selectors.sharingSection).html(self.getTemplate(self.template, self.templatesObject));
            },
            initListeners: function() {
                var self = this;

                self.listenTo(self.parent, 'viewReady', function() {
                    self.render();
                    self.parent.trigger(self.sectionName + 'Ready');
                });
                self.listenTo(self.parent, 'pollReceived', function(poll) {
                    self.pollId = poll.id;
                });
            },
            fbShare: function(e) {
                var self = this;

                self.openSharingDialog(self.socialServiceUrls.FBShareUrl);
                self.parent.trigger('trackEvent', ShDefault.fbTrackActionName);
            },
            googleShare: function(e) {
                var self = this;

                self.openSharingDialog(self.socialServiceUrls.GoogleShareUrl);
                self.parent.trigger('trackEvent', ShDefault.googleTrackActionName);
            },
            twitterShare: function(e) {
                var self = this;
                window.open(
                    self.socialServiceUrls.TWShareUrl  + '&url=' + encodeURIComponent(self.insightBaseUrl + '/' + self.pollId +'/' + self.widgetCode),
                    '',
                    self.popupSettings
                );

                // self.openSharingDialog(self.socialServiceUrls.TWShareUrl);
                self.parent.trigger('trackEvent', ShDefault.twTrackActionName);
            },
            linkedInShare: function(e) {
                var self = this;

                self.openSharingDialog(self.socialServiceUrls.LinkedInShareUrl);
                self.parent.trigger('trackEvent', ShDefault.LinkedInTrackActionName);
            },
            openSharingDialog: function(serviceUrl) {
                var self = this;

                window.open(
                    serviceUrl + self.getSharedLink(),
                    '',
                    self.popupSettings
                );
            },
            getSharedLink: function() {
                var self = this;

                return encodeURIComponent(self.insightBaseUrl + '/' + self.pollId +'/' + self.widgetCode);
            }
        });

        return InsightSharingSections;
    }
);