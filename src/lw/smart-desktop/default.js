import App from '../app/core';
import tpl from '../common/templates/default.html';
import widgetTypes from '../app/core/helpers/settings/widget-types/smart3';
import Cache from '../app/core/helpers/cache';
import checkCookies from '../app/core/helpers/auth/check-cookies';
import Ajax from '../app/core/helpers/ajax';
import _ from 'underscore';

export default App.View.defaultView.extend({
  el: '#body',
  resizeEvent: null,
  widgetEventsHandler: null,
  styles: {},
  widgetSizeParams: {},
  googleAnalyticsTrackerName: '/widget',
  pollsCount: 0,
  rotationInterval: 10000,
  votesCounter: 0,
  votesCounterExpirationTime: 240,
  rotationIntervalId: null,
  rotationTimeoutId: null,
  isMouseOver: false,
  isVotingPanelActive: true,
  isRotationStarted: false,
  isRotationEnabled: true,
  isStickyPoll: false,
  isWidgetVisibleOnPage: false,
  isPartnerPageActive: true,
  partnerPageUrl: null,
  isResizableWidget: false,
  adUnitVotesCounter: 0,
  adInitialized: false,
  adUnitDisplay: true,
  initialize: function () {
    var self = this;

    self.eventsListenerInit();
    self.prepareCss(self.prepareTpl(tpl));
    self.resizeWidgetHeight();
    self.partnerPageUrl = decodeURIComponent(owPreparedData.urlArguments.location);

    if ('rotationFrequency' in widgetTypes) {
      self.rotationInterval = widgetTypes.rotationFrequency * 1000;
      self.rotationInterval = (self.rotationFrequency - 0) ? self.rotationFrequency * 1000 : self.rotationInterval;
    }

    self.resizeEvent = window.addEventListener('resize', _.debounce(function () {
      self.onWindowResize();
    }, 200), true);

    self.postMessage('action', {
      method: 'pushStyles',
      arguments: [self.token, self.styles.main]
    });

    self.postMessage('action', {
      method: 'pushBannerProp',
      arguments: [self.token, self.adUnits]
    });

    if (!_.isEmpty(self.adUnits)) {
      self.initializeAdView();
    }

    self.dimension1 = self.widgetCode;
    self.dimension3 = (self.partner !== null ? self.partner.externalId : undefined);

    ga('set', 'dimension1', self.dimension1);
    ga('set', 'dimension3', self.dimension3);
    ga('set', 'dimension4', widgetTypes.customType);
    ga('set', 'dimension5', 'desktop');
    ga('send', 'pageview', self.googleAnalyticsTrackerName);
    self.onInitialize();
  },
  eventsListenerInit: function () {
    var self = this,
      eventMethod = window.addEventListener ? "addEventListener" : "attachEvent",
      messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message",
      widgetListenerInit = window[eventMethod];

    self.widgetEventsHandler = function (event) {
      var message = event.data;

      if (message) {
        switch (message.type) {
          case 'action':
          case 'actionForChildsView':
            if ('function' === typeof self[message.data.method]) {
              self[message.data.method]();
            }
            break;

          case 'actionWithArguments':
            if ('function' === typeof self[message.data.method]) {
              self[message.data.method](message.data);
            }
            break;
        }
      }
    };

    widgetListenerInit(messageEvent, self.widgetEventsHandler, false);
  },
  prepareCss: function () {
    var self = this,
      re = /<css[\s\t]+id=\"((?!\")\w+)\"[\s\t]*>(((?!<\/css).)*)<\/css>/g;

    tpl.replace(/(\r\n|\n|\r)/gm, "").replace(re, function (matchStr, id, css) {
      self.styles[id] = css;
    });
  },
  postMessage: function (type, data) {
    parent.postMessage({
      type: type,
      data: data
    }, '*');
  },
  resizeWidgetHeight: function (params) {
    var self = this,
      widgetParams = ('undefined' !== typeof params) ? params : {},
      widgetWidth,
      widgetHeight = widgetParams.height || self.height,
      widgetMinWidth = widgetParams.minWidth || self.minWidth;

    if (!parseInt(self.width) || self.isResizableWidget) {
      widgetWidth = '100%';
    }
    else if (!self.isResizableWidget) {
      widgetWidth = widgetParams.width ? widgetParams.width + 'px' : self.width + 'px';
    }

    self.widgetSizeParams = {
      width: widgetWidth,
      height: parseInt(widgetHeight)
    };

    self.postMessage('action', {
      method: 'resize',
      arguments: [self.token, widgetWidth, widgetHeight + 'px', widgetMinWidth + 'px']
    });
  },
  initializeAdView: function () {
    var self = this;

    require(['js/banners'], function (bannerConstructors) {
      var adMatching = {
        'top': 'adUnitPlacementOnTop',
        'left': 'adUnitPlacementOnLeft',
        'right': 'adUnitPlacementOnRight',
        'bottom': 'adUnitPlacementOnBottom',
        'pollRotation': 'adUnitInPollRotationDialog'
      };

      self.adUnit = new bannerConstructors.adUnit({parent: self});
      self.adUnitPlacementOnTop = new bannerConstructors.adUnitPlacementOnTop({parent: self});
      self.adUnitPlacementOnLeft = new bannerConstructors.adUnitPlacementOnLeft({parent: self});
      self.adUnitPlacementOnRight = new bannerConstructors.adUnitPlacementOnRight({parent: self});
      self.adUnitPlacementOnBottom = new bannerConstructors.adUnitPlacementOnBottom({parent: self});
      self.adUnitInPollRotationDialog = new bannerConstructors.bannerInPollRotationDialog({parent: self});

      _.each(self.adUnits, function (banner) {
        self[adMatching[banner.placement]].initializeBannerSettings(banner, self.token);
      });

      self.postMessage('action', {
        method: 'checkWidgetVisibility',
        arguments: ['actionWithArguments', self.token, 'setWidgetVisibility']
      });

      self.adInitialized = true;
    });
  },
  setBannerVisibility: function (visibility) {
    var self = this;

    if (self.adInitialized) {
      self.adUnitPlacementOnTop.isVisible = visibility.isBannerVisible.top;
      self.adUnitPlacementOnBottom.isVisible = visibility.isBannerVisible.bottom;
    }
  },
  setWidgetVisibility: function (visibility) {
    var self = this;

    self.isWidgetVisibleOnPage = visibility.isWidgetVisible;

    if (self.isWidgetVisibleOnPage && !self.isFirstPollViewed) {
      self.trigger('trackView');
    }
    else if (!self.isWidgetVisibleOnPage) {
      self.stopRotation();
    }
    else {
      self.startRotation();
    }
  },
  setPageStatus: function (activeTab) {
    var self = this,
      partnerPageParams = activeTab.partnerActivePageParams;

    self.isPartnerPageActive = !partnerPageParams.isBlured && partnerPageParams.isFocused;
  },
  showNextPoll: function () {
    var self = this,
      currentElementIndex = self.pollsCollection.currentElementIndex;

    if (0 < self.pollsCollection.length) {
      clearTimeout(self.rotationTimeoutId);
      if (currentElementIndex + 1 === self.pollsCollection.length && self.requestNewPolls) {
        $.when(self.fetchNewPolls('next'), self.asyncFetch).then(function () {
          nextPoll();
        });
      }
      else {
        nextPoll();
      }

      function nextPoll() {
        self.pollsCollection.next();
        self.showPoll();
        self.showVotingPanel();
      }

      self.isStickyPoll = false;
    }

    return self;
  },
  showPrevPoll: function () {
    var self = this;

    if (0 < self.pollsCollection.length) {
      self.pollsCollection.prev();
      self.showPoll();
      self.showVotingPanel();
      self.isStickyPoll = false;
    }

    return self;
  },
  voteForSide: function (pollSideId, voteToken, callback) {
    var self = this;
    var sides = self.pollsCollection.getCurrentElement().get('sides').toJSON();
    var votedSide = sides.filter(function (side) { return side.id === pollSideId })[0];
    var additionalInfo = votedSide.additionalInfo || '';
    var relatedLink = self.pollsCollection.getCurrentElement().get('relatedUrl');
    var isRelatedToCurrentUrl = self.pollsCollection.getCurrentElement().isRelatedToCurrentUrl;
    var redirectTo = '';
    var voteCallback = function () {
      Ajax({
        url: App.config.URL_SERVER_API_NEW + 'poll-vote/poll-side/' + voteToken,
        type: 'POST',
        showLoader: false,
        data: {
          sourceType: 'poller',
          widgetCode: self.widgetCode,
          increaseView: true,
          urlVotedFrom: self.partnerPageUrl
        },
        success: function (data) {
          var poll = self.pollsCollection.getCurrentElement(),
            lastVotedSide = poll.get('sides').get(poll.get('votedForSide')),
            newVotedSide = poll.get('sides').get(pollSideId);

          if (lastVotedSide) {
            poll.set({'totalVotes': poll.get('totalVotes') - 1});
            lastVotedSide.set({votes: lastVotedSide.get('votes') - 1});
          }

          if (data && data.id) {
            poll.set({'voteId': data.id});
          }

          poll.set({'totalVotes': poll.get('totalVotes') + 1});
          newVotedSide.set({'votes': newVotedSide.get('votes') + 1});
          poll.set({'votedForSide': pollSideId});
          poll.get('sides').recalculatePercentageOfSides(poll.get('totalVotes'));
          if (callback) callback.apply(this, arguments);

          ga('send', 'event', 'poll_vote', '' + poll.get('id') + '', '' + pollSideId + '');

          if (self.isStickyPoll) {
            self.rotationTimeoutId = setTimeout(function () {
              self.isStickyPoll = false;
              clearInterval(self.rotationIntervalId);
              self.showNextPoll();
            }, 20000);
          }
        }
      });
    };

    if (self.redirectByVote) {
      if (additionalInfo && !!~additionalInfo.trim().indexOf('http')) {
        redirectTo = additionalInfo;
      } else if (relatedLink && !isRelatedToCurrentUrl) {
        redirectTo = relatedLink;
      }

      if (redirectTo) window.open(redirectTo);
    }

    checkCookies(voteCallback);
  },
  getPolls: function (callback) {
    var self = this;

    Ajax({
      url: App.config.URL_SERVER_API_NEW + 'poll/widget/' + self.widgetCode + '/' + self.displayLocale,
      type: 'GET',
      data: {
        pageSize: self.pollsCount,
        location: self.partnerPageUrl
      },
      success: function (data) {
        if (data && 'com.oneworldonline.backend.apiresults.Error' !== data.type) {
          self.polls = data;
          self.pollsCount = self.polls.length;
          self.pollsCollection = self.createPollsCollection(self.polls);

          if (0 < self.pollsCollection.length) {
            for (var attr in self.polls) {
              if (self.polls.hasOwnProperty(attr)) {
                self.excludedPolls.push(self.polls[attr].id);
              }
            }

            if (self.pollsCollection.getCurrentElement().isRelatedToCurrentUrl && !self.pollsCollection.getCurrentElement().get('votedForSide')) {
              self.isStickyPoll = true;
            }

            callback.apply(self, arguments);
            self.saveVotesCounterInCache();
          }
          else {
            self.isEmptyPoll = true;
            self.initializedEmptyPoll();
          }
        }
      }
    });

    return self;
  },
  saveVotesCounterInCache: function () {
    var self = this;

    if (self.enableConversionWindow) {
      try {
        Cache.write('widgetVotesCounter_' + self.widgetCode, self.votesCounter, self.votesCounterExpirationTime);
      }
      catch (eventError) {
      }
    }

    if (self.adUnitDisplay) {
      try {
        Cache.write('widgetAdUnitVotesCounter_' + self.widgetCode, self.adUnitVotesCounter, self.votesCounterExpirationTime);
      }
      catch (eventError) {
      }
    }
  },
  incrementWidgetVotesCounter: function () {
    var self = this;

    if (self.enableConversionWindow) {
      self.votesCounter = parseInt(Cache.read('widgetVotesCounter_' + self.widgetCode)) + 1;
    }
    if (self.adUnitDisplay) {
      var votesCounter = parseInt(Cache.read('widgetAdUnitVotesCounter_' + self.widgetCode)) + 1;
      increment(votesCounter);
    }

    //for safari
    function increment(vote) {
      if (isNaN(vote)) self.adUnitVotesCounter += 1;
      if (!isNaN(vote)) self.adUnitVotesCounter = parseInt(Cache.read('widgetAdUnitVotesCounter_' + self.widgetCode)) + 1;
    }

    self.saveVotesCounterInCache();
  },
  processMouseOver: function () {
    var self = this;

    self.isMouseOver = true;
    self.stopRotation();
  },
  processMouseOut: function () {
    var self = this;

    self.isMouseOver = false;
    self.startRotation();
  },
  startRotation: function () {
    var self = this;

    if (!self.isMouseOver && !self.isStickyPoll && !self.isRotationStarted && self.isRotationEnabled &&
      self.isWidgetVisibleOnPage && self.isPartnerPageActive && self.isFirstPollViewed && self.isVotingPanelActive) {
      self.isRotationStarted = true;
      self.rotationIntervalId = setInterval(function () {
        if (self.isRotationStarted && self.pollsCollection.length > 1) {
          self.showNextPoll();
        }
      }, self.rotationInterval);
    }
  },
  stopRotation: function () {
    var self = this;

    if ((self.isMouseOver || !self.isVotingPanelActive) && self.isWidgetVisibleOnPage && self.isPartnerPageActive && self.isRotationStarted) {
      self.isRotationStarted = false;
      clearInterval(self.rotationIntervalId);
    }
    else if ((!self.isWidgetVisibleOnPage || !self.isPartnerPageActive)) {
      self.isRotationStarted = false;
      clearInterval(self.rotationIntervalId);
    }
  },
  trackWidgetLoading: function () {
    var self = this;

    Ajax({
      url: App.config.URL_SERVER_API_NEW + 'widget/' + self.widgetCode + '/location',
      showLoader: false,
      type: 'GET',
      data: {
        location: self.partnerPageUrl,
        deviceType: 'desktop'
      }
    });
  },
  trackBannerRender: function (widgetCode, adUnitId) {
    var self = this;

    Ajax({
      url: App.config.URL_SERVER_API_NEW + 'adunit/' + adUnitId + '/view',
      showLoader: false,
      type: 'GET',
      data: {
        widgetCode: widgetCode,
        location: self.partnerPageUrl
      }
    });
  },
  trackPollViews: function (currentPoll) {
    var self = this,
      pollObjectProp = currentPoll;

    if (!pollObjectProp.hasOwnProperty('isViewed') && !pollObjectProp.get('voted') && self.isWidgetVisibleOnPage && self.isPartnerPageActive) {
      Ajax({
        url: App.config.URL_SERVER_API_NEW + 'poll/' + pollObjectProp.id + '/view',
        showLoader: false,
        type: 'POST'
      });
    }

    if (!self.isFirstPollViewed) {
      self.isFirstPollViewed = true;
    }

    pollObjectProp.isViewed = true;
  }
});