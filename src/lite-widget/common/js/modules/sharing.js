define(
    'js/modules/sharing',
    [
        'app',
        'helpers/ajax/ajax-wrapper'
    ],
    function (App, Ajax) {
        var sharingDialog = App.View.defaultView.extend({
            el: '#body',
            events: {
                'click .js-fb-share-btn': 'fbShare',
                'click .js-g-plusone-share-btn': 'gPlusOneShare',
                'click .js-twitter-share-btn': 'twitterShare',
                'click .js-linked-in-share-btn': 'linkedInShare',
                'click .js-weibo-share-btn': 'weiboShare',
                'click .js-vk-share-btn': 'vkShare'
            },
            fbShare: function(e) {
                var self = this,
                    type = self.$(e.currentTarget).data('mode'),
                    serviceUrl = 'https://www.facebook.com/sharer/sharer.php?u=';

                self.initiateSharing(serviceUrl, type);
                self.trackSharingAction('fb_sharing_click');
            },
            gPlusOneShare: function(e) {
                var self = this,
                    type = self.$(e.currentTarget).data('mode'),
                    serviceUrl = 'https://plus.google.com/share?url=';

                self.initiateSharing(serviceUrl, type);
                self.trackSharingAction('google_sharing_click');
            },
            twitterShare: function(e) {
                var self = this,
                    type = self.$(e.currentTarget).data('mode'),
                    poll = type ? null : self.parent.pollsCollection.getCurrentElement(),
                    votedSide = type ? null : poll.get('sides').get(poll.get('votedForSide')),
                    serviceUrl = 'https://twitter.com/share?text=',
                    maxLength = 140,
                    tagline,
                    msg;

                if (poll) {
                    if (poll.get('tagline')) tagline = poll.get('tagline');
                    if (poll.get('tagLine')) tagline = poll.get('tagLine');
                }
                if (votedSide && !type) msg = $.i18n.prop('overall.widget.twitter_sharing_message_tagline_choice', tagline, votedSide.get('answer')) + '&url=';
                if (!votedSide && !type) msg =  $.i18n.prop('overall.widget.twitter_sharing_message', tagline) + '&url=';
                if (type) msg = self.parent.name + '&url=';
                if (msg > maxLength) msg = '&url=';
                serviceUrl = serviceUrl + msg;

                self.initiateSharing(serviceUrl, type);
                self.trackSharingAction('twitter_sharing_click');
            },
            linkedInShare: function(e) {
                var self = this,
                    type = self.$(e.currentTarget).data('mode'),
                    serviceUrl = 'https://www.linkedin.com/shareArticle?mini=true&url=';

                self.initiateSharing(serviceUrl, type);
                self.trackSharingAction('linkedin_sharing_click');
            },
            weiboShare: function(e) {
                var self = this,
                    type = self.$(e.currentTarget).data('mode'),
                    poll = type ? null : self.parent.pollsCollection.getCurrentElement(),
                    votedSide = type ? null : poll.get('sides').get(poll.get('votedForSide')),
                    serviceUrl = 'http://service.weibo.com/share/share.php?appkey=&title=',
                    additionalParams = '&pic=' + poll.get('icon') + '&ralateUid=&url=',
                    tagline,
                    msg;

                if (poll) {
                    if (poll.get('tagline')) tagline = poll.get('tagline');
                    if (poll.get('tagLine')) tagline = poll.get('tagLine');
                }

                if (!type) {
                    if (votedSide) {
                        msg = encodeURIComponent($.i18n.prop('overall.widget.twitter_sharing_message', tagline, votedSide.get('answer')));
                    }
                    else {
                        msg = encodeURIComponent($.i18n.prop('overall.widget.twitter_sharing_message', tagline));
                    }   
                }
                else {
                    msg = encodeURIComponent('Trivia: ');
                }

                self.initiateSharing(serviceUrl + msg + additionalParams, type);
                self.trackSharingAction('weibo_sharing_click');
            },
            vkShare: function(e) {
                var self = this,
                    type = self.$(e.currentTarget).data('mode'),
                    serviceUrl = 'http://vk.com/share.php?url=';

                self.initiateSharing(serviceUrl, type);
                self.trackSharingAction('vkontakte_sharing_click');
            },
            initiateSharing: function(serviceUrl, type) {
                var self = this;
                
                if (type === 'widgetShare') {
                    self.openWidgetSharingDialog(serviceUrl);
                } else {
                    self.openSharingDialog(serviceUrl);
                }
            },
            openSharingDialog: function(serviceUrl) {
                var self = this,
                    poll = self.parent.pollsCollection.getCurrentElement(),
                    votedSide = poll.get('sides').get(poll.get('votedForSide')),
                    voteSharing = App.config.URL_SERVER_REST + 'sharing/vote/',
                    pollSharing = App.config.URL_SERVER_REST + 'sharing/poll/',
                    params = {
                        sharing: votedSide ? voteSharing : pollSharing,
                        locale: self.parent.displayLocale,
                        voteId: poll.get('voteId'),
                        guid: poll.get('guid'),
                        url: poll.get('relatedUrl') ? poll.get('relatedUrl') : self.parent.partnerPageUrl
                    };

                function openSharing(params) {
                    var uniqID = params.voteId || params.guid,
                        url = !params.voteId ? '?url=' + params.url : '';

                    window.open(serviceUrl + 
                        encodeURIComponent(
                            params.sharing + params.locale + '/' + uniqID + '/' + self.parent.widgetCode + url
                        ),
                        '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600'
                    );   
                }

                openSharing(params);
            },
            openWidgetSharingDialog: function(serviceUrl) {
                var self = this,
                    params = {
                        sharing: App.config.URL_SERVER_REST + 'sharing/trivia/',
                        widgetCode: self.parent.widgetCode,
                        location: self.parent.partnerPageUrl
                    };

                function openSharing(params) {
                    window.open(serviceUrl + encodeURIComponent(params.sharing + params.widgetCode + '?url=' + params.location),
                        '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600'
                    );   
                }

                openSharing(params);
            },
            trackSharingAction: function(eventName) {
                var self = this,
                    data = {
                        sourceType: 'widget',
                        sourceCode: self.parent.widgetCode,
                        event: eventName
                    },
                    currentPollId;

                if (self.parent.pollsCollection && self.parent.pollsCollection.length && self.parent.pollsCollection.getCurrentElement()) {
                    currentPollId = self.parent.pollsCollection.getCurrentElement().get('id');
                    data.poll = currentPollId;
                }

                Ajax({
                    url: App.config.URL_SERVER_API_NEW + 'event-track',
                    type: 'GET',
                    data: data
                });
            }
        });
        
        return sharingDialog;
    }
);
