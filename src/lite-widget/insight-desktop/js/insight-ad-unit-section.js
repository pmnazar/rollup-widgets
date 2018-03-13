define(
    'insight-ad-unit-section',
    [
        'default',
        'ad.config'
    ],
    function(DefaultView, config) {
        var InsightAdUnitSection = DefaultView.extend({
            insightEntity: {},
            templates: {
                mainAdsWithVideoContainer: 'tplMainAdsWithVideoContainer',
                noVideoAdsContainer: 'tplMainAdsNoVideoContainer'
            },
            containerIds: [],
            defaultAdunitsToLoad: {
                adUnit1: true,
                adUnit2: true,
                adUnit3: true,
                adUnit4: true,
                adUnit5: true
            },
            adUnitsSettings: {
                className: {
                    adUnit1: 'ad-unit-one',
                    adUnit2: 'square-300x250',
                    adUnit3: 'square-300x250',
                    adUnit4: 'top-728x90',
                    adUnit5: 'square-300x250'
                }
            },
            selectors: {
                adUnit1: '.js-ad-unit-one',
                adUnit2: '.js-ad-unit-two',
                adUnit3: '.js-ad-unit-three',
                adUnit4: '.js-ad-unit-four',
                adUnit5: '.js-ad-unit-five',
                mainAdsWithVideoContainer: '.js-main-ads-with-video-container',
                underPollInfoAdsContainer: '.js-no-video-side-ads-container'
            },
            onInitialize: function() {
                var self = this;

                self.initListeners();
                self.render();
                self.hideSectionLoader();
            },
            initListeners: function() {
                var self = this;

                self.listenTo(self.parent, 'pollReceived', function() {
                    self.onPollReceived();
                });
            },
            onPollReceived: function() {
                var self = this;

                self.showSectionLoader();
                self.render();
                self.hideSectionLoader();
            },
            onRender: function() {
                var self = this;

                self.parent.trigger(self.sectionName + 'Ready');
                self.renderAdSectionContainer();

                self.renderAdUnitSections();
                self.parent.trigger('viewReady', self);
            },
            renderAdSectionContainer: function() {
                var self = this,
                    containerTpl,
                    selector,
                    isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

                if (!isMobileDevice) {
                    if (self.insightEntity.adUnit1) {
                        containerTpl = self.templates.mainAdsWithVideoContainer;
                        selector = self.selectors.mainAdsWithVideoContainer;
                    }
                    else {
                        containerTpl = self.templates.noVideoAdsContainer;
                        selector = self.selectors.underPollInfoAdsContainer;
                    }
                }
                else {
                    selector = self.selectors.underPollInfoAdsContainer;

                    if (self.insightEntity.adUnit1) {
                        containerTpl = self.templates.mainAdsWithVideoContainer;
                    }
                    else {
                        containerTpl = self.templates.noVideoAdsContainer;
                    }
                    // containerTpl = self.templates.noVideoAdsContainer;
                    // self.insightEntity.adUnit1 = null; //temporary solution while we do not show video in mobile version
                }

                self.$(selector).html(self.getTemplate(containerTpl, self.templatesObject, {
                    sectionColor: self.insightEntity.sectionColor,
                    insightLocale: self.insightEntity.widgetLocale
                }));
            },
            renderAdUnitSections: function() {
                var self = this,
                    iframe, adIds = [];

                if (typeof ADTECH === 'undefined') {
                    ADTECH = false;
                }

                $.each(self.defaultAdunitsToLoad, function(adName, adStatus) {
                    var div,
                        containerId;

                    if (adStatus && self.insightEntity[adName]) {
                        self.$(self.selectors[adName]).removeClass('hide');
                        iframe = self.createAdUnitIframe(adName);

                        self.$(self.selectors[adName]).html(iframe);
                        self.injectADScript(iframe, adName);
                    }
                });
                _.each(adIds, function(id) {
                    ADTECH && ADTECH.enqueueAd(id);
                });
                ADTECH && ADTECH.executeQueue();
            },
            createAdUnitIframe: function(adName) {
                var self = this,
                    frame = document.createElement('iframe');

                frame.setAttribute('id', adName);
                frame.setAttribute('class', self.adUnitsSettings.className[adName]);
                frame.setAttribute('src', 'javascript:0');

                return frame;
            },
            injectADScript: function(iframe, adName) {
                var self = this,
                    iframeContent,
                    body,
                    bStyle = 'margin:0;overflow:hidden;',
                    style,
                    sStyle;

                iframeContent = (iframe.contentDocument || iframe.contentWindow.document);
                body = iframeContent.createElement('body');
                body.innerHTML = self.insightEntity[adName].jsCode;
                body.setAttribute('style', bStyle);
                if (adName === 'adUnit1') {
                    sStyle = 'iframe, object, embed { position:absolute; top:0; left:0; width:100%; height:100%; }';
                    style = iframeContent.createElement('style');
                    style.innerHTML = sStyle;
                }
                if (adName === 'adUnit2' | adName === 'adUnit3') {
                    sStyle = 'iframe, object, embed {width:100%; height:100%;}';
                    style = iframeContent.createElement('style');
                    style.innerHTML = sStyle;
                }
                $(body).prepend(style);

                iframeContent.open();

                try {
                    iframeContent.write(body.outerHTML);
                }
                catch (e) {
                    iframeContent.write(iframeContent.createElement('body').innerHTML = self.insightEntity[adName].jsCode);
                }

                iframeContent.close();
            }
        });

        return InsightAdUnitSection;
    }
);