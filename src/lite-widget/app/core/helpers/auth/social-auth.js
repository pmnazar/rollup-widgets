define('socialAuth',
	[	
		'app',
		'helpers/ajax/ajax-wrapper'
	],
	function(App, Ajax) {
		var auth = {};

		auth = {
			authPopup: null,
			authCode: null,
			isPopUpListen: false,
            popUpEventsHandler: null,
			oAuthCallBack: {},
			popupParam: 'resizable=yes,height=500,width=400,toolbar=no,titlebar=no,menubar=no,scrollbars=yes',
			FBAuth: {
		        url: 'https://www.facebook.com/dialog/oauth',
		        memberAuth: App.config.URL_SERVER + 'Member1FacebookOAuth2ByCode',
		        queryParam: {
		            client_id: App.config.FACEBOOK_ID,
		            slug: App.config.PARTNER_PREFIX,
		            response_type: 'code',
		            scope: 'email, user_posts',
		            redirect_uri: App.config.FRONT_STATIC + 'widget/oauth.html'
		        },
		        signInParam: {
	        		redirectUrl: App.config.FRONT_STATIC + 'widget/oauth.html',
	        		slug: App.config.PARTNER_PREFIX
		        }
		    },
		    TWAuth: {
		    	url: null,
		        oAuth: App.config.URL_SERVER + 'Member1GetLoginUrl',
		        memberAuth: App.config.URL_SERVER + 'Member1LoginService',
		        byMember1Login: true,
		        oAuthParams: {
		        	service: 'twitter',
		        	callbackUrl: App.config.FRONT_STATIC + 'widget/oauth.html',
		        	slug: App.config.PARTNER_PREFIX
		        },
		        signInParam: {
		            service: 'twitter',
		            rememberMe: true,
		            locale: 'en',
		            slug: App.config.PARTNER_PREFIX
		        }
		    },
		    GOAuth: {
		        url: 'https://accounts.google.com/o/oauth2/v2/auth',
		        memberAuth: App.config.URL_SERVER + 'Member1GoogleOAuth2ByCode',
				queryParam: {
		            client_id: App.config.GOOGLE_CLIENT_ID,
		            slug: App.config.PARTNER_PREFIX,
		            response_type: 'code',
		            scope: 'email profile',
		            include_granted_scopes: true,
		            redirect_uri: App.config.FRONT_STATIC + 'widget/oauth.html'
		        },
		        signInParam: {
		        	redirectUrl: App.config.FRONT_STATIC + 'widget/oauth.html',
		        	slug: App.config.PARTNER_PREFIX
		        }
		    },
			VKAuth: {
				url: null,
				oAuth: App.config.URL_SERVER + 'Member1GetLoginUrl',
                memberAuth: App.config.URL_SERVER + 'Member1LoginService',
                oAuthParams: {
		        	service: 'vkontakte',
		        	callbackUrl: App.config.FRONT_STATIC + 'widget/oauth.html',
		        	slug: App.config.PARTNER_PREFIX
                },
                signInParam: {
                    service: 'vkontakte',
                    rememberMe: true,
                    token: App.config.FRONT_STATIC + 'widget/oauth.html',
                    locale: 'en',
                    slug: App.config.PARTNER_PREFIX
                }
            },
		    tryAuth: function(authBy, callbackObject) {
		    	var self = this;

                if (!self.isPopUpListen && Object.keys(self.oAuthCallBack).length <= 0) {
                    self.authPopup = window.open('about:blank', '', self.popupParam);
                    self.initializePopUpListener();
                    self.oAuthCallBack = callbackObject;
                    self.isPopUpListen = true;
                }
                else if (self.authPopup.closed) {
                    self.authPopup = window.open('about:blank', '', self.popupParam);
                    self.oAuthCallBack.context.stopListening(self.oAuthCallBack.context, 'oAuthWindowClose');
                }

                if (!self[authBy].url) {
                    self.getAuthLink(authBy, self.oAuthCallBack);
                } else {
                    self.authPopup.location.href = self.setAuthLink(self[authBy]);
                    self.oAuthCallBack.context.listenTo(self.oAuthCallBack.context, 'oAuthWindowClose', function (url) {
                        try {
                            if ((url.indexOf(App.config.DOMAIN_URL) !== -1) || (url.indexOf(App.config.FRONT_STATIC) !== -1)) {
                                extractAuthCode(url, authBy);
                                self.signIn(self[authBy]);
                                if ('oAuthParams' in self[authBy]) self[authBy].url = null;
				    			if (!navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS (6_|7_|8_)\d/i)) self.authPopup.postMessage('closeWindow', '*');
                            }
                        }
                        catch (e) {
                            if (navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS (6_|7_|8_)\d/i) && self.oAuthCallBack) {
                                self.oAuthCallBack.func.call(self.oAuthCallBack.context);
                            }
                        }
                    });
                }

		    	function extractAuthCode(url, authBy) {
		    		var parsedUrl = {},
						urlElement,
						query,
						value;

						urlElement = document.createElement('a');
						urlElement.href = url;
						query = urlElement.search.substring(1);
						value = query.split('&');

					for (var i = 0; i < value.length; i++) {
					    var pair = value[i].split('=');
					    switch (pair[0]) {
					    	case 'code':
					    	case 'oauth_verifier':
					    		self[authBy].signInParam.code = pair[1];
					    		break;
					    	case 'oauth_token':
					    		self[authBy].signInParam.token = pair[1];
					    		break;
					    	default:
					    		self[authBy].signInParam[pair[0]] = pair[1];
					    }
					}
		    	}
		    },
		    getAuthLink: function(authBy, callbackObject) {
		    	var self = this;

		    	return Ajax({
		    		url: self[authBy].oAuth,
		    		data: {
		    			callbackUrl: self[authBy].oAuthParams.callbackUrl,
		    			service: self[authBy].oAuthParams.service,
		    			slug: App.config.PARTNER_PREFIX
		    		},
		    		success: function(response) {
		    			self[authBy].url = response;
		    			self.tryAuth(authBy, callbackObject);
		    		}
		    	});
		    },
		    setAuthLink: function(settings) {
		    	var self = this,
		    		queryParam = settings.queryParam,
		    		query = '?';

				for (var prop in queryParam) {
                    if (queryParam.hasOwnProperty(prop)) {
                        if (query.length > 0) {
                            query += '&';
                        }
                        query += encodeURI(prop + '=' + queryParam[prop]);
                    }
                }

		    	return queryParam ? settings.url + query : settings.url;
		    },
		    signIn: function(params) {
		    	var self = this;

	    		Ajax({
	    			type: 'POST',
	    			url: params.memberAuth,
                    data: JSON.stringify(params.signInParam),
                    contentType: 'application/json',
                    success: function(response) {
                    	if ('accountId' in response) App.auth = response;
                    	if (self.oAuthCallBack) self.oAuthCallBack.func.call(self.oAuthCallBack.context);
                    }
	    		});
		    },
		    checkAuth: function(callback) {
		    	Ajax({
		    		url: App.config.URL_SERVER_API_NEW + 'account',
					dataType: 'json',
                	type: 'GET',
                	success: function(response) {
                		App.auth = 'id' in response ? response : null;
                	}
		    	});
		    },
			hasAccess: function(role) { //role deprecated
    			var result = false;

	            if (arguments.length > 0 && App.auth && 'roles' in App.auth) {
	                for (var i = 0; i < arguments.length; i++) {
	                    if (App.auth.roles.indexOf(arguments[i]) === -1) {
	                        result = true;
	                        break;
	                    }
	                }
	            }
	            else {
	                result = false;
	            }

	            return result;
			},
			initializePopUpListener: function () {
                var self = this,
                    eventMethod = window.addEventListener ? "addEventListener" : "attachEvent",
                    messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message",
                    widgetListenerInit = window[eventMethod];

                self.popUpEventsHandler = function (event) {
                    var message = event.data;

                    if (message) {
                        switch (message.type) {
                            case 'oAuth':
                                if ('function' === typeof self[message.data.method]) {
                                    self[message.data.method](message.data);
                                }
                                break;
                        }
                    }
                };

                widgetListenerInit(messageEvent, self.popUpEventsHandler, false);
            },
            triggeroAuthWindowClose: function (reciveAuthObject) {
                var self = this;

                if ('location' in reciveAuthObject) {
                    self.oAuthCallBack.context.trigger('oAuthWindowClose', reciveAuthObject.location);
                }
            }
		};

		return auth;
	} 
);
