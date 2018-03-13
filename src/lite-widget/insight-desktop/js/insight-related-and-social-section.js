define(
    'insight-related-and-social-section',
    [
        'default'
    ],
    function (DefaultView) {
        var InsightRelatedAndSocialSection = DefaultView.extend({
            el: '.js-related-and-social-section',
            voteCollection: {},
            regionName: '',
            template: 'tplRelatedAndSocialSection',
            selectors: {
                relatedScript1: '.js-relative-script-iframe-one',
                relatedScript2: '.js-relative-script-iframe-two'
            },
            iframeNames: {
                relatedScript1: 'related-and-social-script-one-iframe',
                relatedScript2: 'related-and-social-script-two-iframe'
            },
            iframeSettings: {
                className: {
                    relatedScript1: 'related-script-wide',
                    relatedScript2: 'related-script-narow'
                }
            },
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
            onRender: function() {
                var self = this;

                self.$el.html(self.getTemplate(self.template, self.templatesObject, {
                    sectionColor: self.insightEntity.sectionColor,
                    insightLocale: self.insightEntity.widgetLocale
                }));

                self.renderIframeSections();
                self.parent.trigger('viewReady', self);
                self.parent.trigger(self.sectionName + 'Ready');
                self.hideSectionLoader();
            },
            onPollReceived: function(poll) {
                var self = this;
                
                self.parent.trigger(self.sectionName + 'Ready');
            },
            renderIframeSections: function() {
                var self = this,
                    iframe;

                $.each(self.iframeNames, function(iframeName, id) {
                    iframe = self.createSectionIframe(iframeName, id);
                    self.$(self.selectors[iframeName]).html(iframe);
                    self.injectADScript(iframe, iframeName);
                });
            },
            createSectionIframe: function(iframeName, id) {
                var self = this,
                    frame = document.createElement('iframe');

                frame.setAttribute('id', id);
                frame.setAttribute('class', self.iframeSettings.className[iframeName]);
                frame.setAttribute('src', 'javascript:0');

                return frame;
            },
            injectADScript: function(iframe, iframeName) {
                var self = this,
                    iframeContent,
                    body,
                    bStyle = 'margin:0;',
                    style,
                    sStyle;

                iframeContent = (iframe.contentDocument || iframe.contentWindow.document);
                body = iframeContent.createElement('body');
                body.innerHTML = self.insightEntity[iframeName];
                body.setAttribute('style', bStyle);

                sStyle = 'iframe, object, embed { position:absolute; top:0; left:0; width:100%; height:100%; }';
                style = iframeContent.createElement('style');
                style.innerHTML = sStyle;

                $(body).prepend(style);

                iframeContent.open();

                try {
                    iframeContent.write(body.outerHTML);
                }
                catch (e) {
                    iframeContent.write(iframeContent.createElement('body').innerHTML = self.insightEntity[iframeName]);
                }

                iframeContent.close();
            }
        });

        return InsightRelatedAndSocialSection;
    }
);