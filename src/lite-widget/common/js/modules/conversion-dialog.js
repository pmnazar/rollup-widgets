define(
    'js/modules/conversion-dialog',
    [
        'app',
        'helpers/auth/social-auth',
        'text!common/templates/conversion.tpl'
    ],
    function (App, authBySoc, tpl) {
        return App.View.defaultView.extend({
            el: 'body',
            isRender: false,
            conversionDialogTpl: 'conversionDialog',
            selectors: {
                widgetContainer: '#widget-container',
                $conversionDialogContainer: '#conversion'
            },
            events: {
                'click .js-close-conversion': 'closeDialog',
                'click .js-soc-auth': 'socAuth'
            },
            onInitialize: function () {
                var self = this;

                self.templatesObject = self.prepareTpl(tpl);
            },
            newVote: function () {
                var self = this;

                if (
                    !authBySoc.hasAccess('synthetic')
                    && self.parent.votesCounter
                    && 0 === (self.parent.votesCounter % self.parent.votesCountTriggerConversionWindow)
                    && !navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS (6_|7_|8_)\d/i)
                ) {
                    self.render();
                }
            },
            render: function () {
                var self = this;
                var parent = self.parent;
                var roles = parent.roles || [];
                var isMember = !!~roles.indexOf('member');

                if (!self.isRender) {
                    self.parent.$(self.selectors.widgetContainer)
                        .append(self.getTemplate(self.conversionDialogTpl, self.templatesObject, {
                            conversionWindowText: parent.conversionWindowText,
                            conversionWindowText2ndLine: parent.conversionWindowText2ndLine,
                            conversionWindowTextState: parent.conversionWindowTextState,
                            showFBLike: parent.showFBLike,
                            showTwitterLike: parent.showTwitterLike,
                            showGooglePlusLike: parent.showGooglePlusLike,
                            showVkontakteSharing: parent.showVkontakteSharing,
                            countOfUserScore: parent.countOfUserScore,
                            isMember: isMember,
                            config: parent.config
                        }));

                    self.parent.$(self.selectors.$conversionDialogContainer).show();
                    self.isRender = true;
                }
                else {
                    self.parent.$(self.selectors.$conversionDialogContainer).show();
                }
            },
            closeDialog: function () {
                var self = this;

                self.parent.$(self.selectors.$conversionDialogContainer).hide();
            },
            socAuth: function (event) {
                var self = this;
                var authBy = self.$(event.currentTarget).attr('data-soc');

                authBySoc.tryAuth(authBy, {func: self.closeDialog, context: self});
            }
        });
    }
);
