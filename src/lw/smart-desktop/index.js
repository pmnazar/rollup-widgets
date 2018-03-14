import initView from './default';
import App from '../app/core';
import sharingDialog from '../common/js/modules/sharing';
import conversionDialog from '../common/js/modules/conversion-dialog';
import crowdsourcingPoll from './js/crowdsource-poll';
import smartCollection from '../app/core/collections/smart-collection';
import multisidePollModel from '../app/core/models/smart-multiside-poll-model';
import toFriendlyNumber from '../app/core/helpers/statistic/to-friendly-number';
import hexConvert from '../app/core/helpers/strings/hex-convert';
import authBySoc from '../app/core/helpers/auth/social-auth';
import Img from '../app/core/helpers/images';
import Ajax from '../app/core/helpers/ajax';
import isWhiteLabelHolding from '../app/core/helpers/settings/is-white-label-holding';
import tpl from './templates/smart.html';
import $ from '../app/core/libs/zepto';
import _ from 'underscore';

export default initView.extend({
  $pollContainer: $(),
  $actionViewPortContainer: $(),
  isVotingPanelExpanded: false,
  isVotingProcessRun: false,
  isEmbedCodeShown: false,
  isPollVoted: false,
  pollsCount: 3,
  asyncFetch: null,
  excludedPolls: [],
  isEmptyPoll: true,
  isRender: false,
  isSharingOpen: false,
  isRotate: false,
  isFirstPollViewed: false,
  isOneIndexEmpty: true,
  votingPanelSettings: {},
  setFontSize: null,
  readMoreOverlayDefaultState: null,
  responsiveTaglineContainerWidth: null,
  heightBreakPoint: 250,
  heightBreakPointsClassPrefix: 'media-max-height-',
  isCrowdInitialized: false,
  childs: {},
  canManage: false,
  isAdmin: false,
  requestNewPolls: true,
  selector: {
    pollContainerSelector: '#pollContainer',
    actionViewPortSelector: '#actionViewPort',
    bottomPanelContainersSelector: '#bottomPanelContainer',
    votingButtonsContainersSelector: '#buttonsContainer',
    topPanelSelector: '#topPanel',
    aViewport: '.js-a-viewport',
    buttonsSwitcher: '#buttons-switcher',
    buttonsSwitcherIcon: '.buttons-switcher',
    votePointer: '#vote-pointer',
    votePointerArrow: '.js-arrow',
    pollIcon: '.js-poll-icon',
    actionsForVotedPollContainer: '.js-actions-for-voted-poll-container',
    actionsForVotedPoll: '.js-actions-for-voted-poll',
    readMoreBtn: '.js-read-more-btn',
    closedPollLabelContainer: '.js-closed-poll-label',
    readMoreContainer: '.js-read-more-container',
    countOfUserScore: '#count-of-user-score',
    taglineArea: '.tagline-area'
  },
  tplMain: 'tplWideWidgetBase',
  tplPollContainer: 'tplWideWidgetPollContainer',
  tplVotingPanel: 'tplWideWidgetVotingPanel',
  tplBottomPanel: 'tplBottomPanel',
  tplEmbedCodeDialog: 'tplEmbedCodeDialog',
  tplWidgetEmbedCode: 'tplWidgetEmbedCode',
  tplClosedPollLabel: 'tplClosedPollLabel',
  tplTaglineArea: 'tplTaglineArea',
  countOfUserScore: 0,
  events: {
    'click .js-show-next-poll': 'nextPollInRotation',
    'click .js-show-prev-poll': 'prevPollInRotation',
    'change .js-poll-vote': 'vote',
    'click #buttons-switcher': 'expandVotingPanel',
    'mouseenter #poll-info-view-port': 'expandVotingPanel',
    'mouseleave #poll-info-view-port': 'shrinkVotingPanel',
    'mouseenter .js-show-next-poll, .js-show-prev-poll ': 'shrinkVotingPanel',
    'click .js-close-actions-for-voted-poll-btn': 'hideActionsForVotedPoll',
    'click .js-read-more-btn': 'registerClickOnReadMore',
    'click .js-poll-icon': 'registerClickOnLearnMore',
    'click .js-learn-more': 'registerClickOnLearnMore',
    'click .js-set-crowd-status': 'setCrowdStatus',
    'click #count-of-user-score': 'showConversionWindow',
    'click .js-show-sharing': 'showSharing',
    'mouseenter #body': 'processMouseOver',
    'mouseleave #body': 'processMouseOut'
  },
  onInitialize: function () {
    var self = this;

    self.config = App.config;
    self.templatesObject = self.prepareTpl(tpl);
    if (self.enableCrowPolls) self.widgetCanManage();
    self.getPolls(function () {
      if (0 === self.width) {
        self.width = $(window).width();
        self.isResizableWidget = true;
      }

      self.startTrackView();
      self.isEmptyPoll = false;
      self.readMoreOverlayDefaultState = self.showReadMoreOverlay;
      self.initializeCollectionEvents();
      self.checkForVotes();
      self.render();
      self.trackWidgetLoading();

      self.postMessage('action', {
        method: 'checkWidgetVisibility',
        arguments: ['actionWithArguments', self.token, 'setWidgetVisibility']
      });
    });

    authBySoc.checkAuth();

    self.postMessage('action', {
      method: 'getPageStatus',
      arguments: ['actionWithArguments', self.token, 'setPageStatus']
    });

    self.addHeightBreakPoints();
    if (self.enableConversionWindow) self.childs.conversionDialog = new conversionDialog({parent: self});
    self.childs.sharingDialog = new sharingDialog({parent: self});
  },
  initializedEmptyPoll: function () {
    var self = this;

    self.render();
  },
  widgetCanManage: function () {
    var self = this;

    Ajax({
      url: App.config.URL_SERVER + 'WidgetCanManage',
      type: 'GET',
      showLoader: false,
      data: {
        widgetCode: self.widgetCode
      },
      success: function (data) {
        self.canManage = data;
        //  self.setCrowTagLine();
      }
    });
  },
  initializeCollectionEvents: function () {
    var self = this;

    self.listenTo(self, 'lastCollectionUpdate', function (count) {
      this.pollsCollection.newPollsInCollection = count;
    });
  },
  checkForVotes: function () {
    var self = this;

    self.roles = App.auth.roles;

    self.isPollVoted = !_.isEmpty(App.auth.account);

    for (var type in self.roles) {
      if (self.roles.hasOwnProperty(type)
        && self.roles[type] === 'admin'
        || self.roles[type] === 'partner_admin'
        || self.roles[type] === 'holding_admin') {
        self.isAdmin = true;
      }
    }
  },
  startTrackView: function () {
    var self = this,
      poll = self.pollsCollection.getCurrentElement();

    self.listenTo(self, 'trackView', function () {
      self.trackPollViews(poll);

      if (self.isFirstPollViewed) {
        self.stopListening(self, 'trackView');
      }
    });
  },
  addHeightBreakPoints: function () {
    var self = this;
    var widgetContentHeight = self.height;

    if(widgetContentHeight <= self.heightBreakPoint) {
      self.$el.addClass(self.heightBreakPointsClassPrefix + self.heightBreakPoint);
    }
  },
  onWindowResize: function () {
    var self = this;

    if (!self.isEmptyPoll) {
      if (self.isResizableWidget) {
        self.width = self.$el.width();
        if (self.isVotingPanelActive) {
          self.calculateButtonColumnsNumber();
          self.showVotingPanel();
        }
      }
      else {
        self.appendTextEllipsisToAnswers();
      }

      if (self.enableCrowPolls) {
        self.setCrowTagLine();
      }

      if (self.isRender) {
        self.setResponsiveHeaderText();
        self.setResponsiveTagLine();
        self.setResponsiveVotingBar();
        self.setResponsiveCrowPollContainer();
        Img.resizeImages();
      }
      if (self.adInitialized) self.adUnit.responsiveAdPosition();
    }

    if (self.isEmptyPoll) {
      if (self.enableCrowPolls) {
        self.setResponsiveCrowPollContainer();
      }
      if (self.adInitialized) self.adUnit.responsiveAdPosition();
    }
  },
  render: function () {
    var self = this;
    var partner = self.partner;

    self.isWhiteLabel = isWhiteLabelHolding(partner);

    if (self.isEmptyPoll) {
      self.showReadMoreOverlay = false;

      if (0 === parseInt(self.width)) {
        self.width = $(window).width();
        self.isResizableWidget = true;
      }
    }

    if (!self.isRender) {
      self.$el.html(self.getTemplate(self.tplMain, self.templatesObject, {
        widgetCode: self.widgetCode,
        showFooter: self.showFooter,
        i18n: $.i18n
      }));

      self.checkForOneIndex();
      self.isRender = true;
    }

    if (self.showHeader) self.setHeaderText();

    if (!self.isEmptyPoll) {
      self.showPoll();
      self.showVotingPanel();
    }
    else {
      self.showEmptyPoll();
    }

    if (self.showFooter && self.showUserScore) {
      self.getUserScore()
    }

    if (self.enableCrowPolls && !self.isCrowdInitialized) {
      self.childs.crowdsourcingPoll = new crowdsourcingPoll({parent: self});
      if (
        self.isEmptyPoll
        || (
          !self.isEmptyPoll
          && self.showCrowdScreenIfNo1IndexPoll
          && self.isOneIndexEmpty
        )
      ) {
        self.childs.crowdsourcingPoll.startCrowPoll();
        self.setResponsiveCrowPollContainer();
      }
    }
  },
  checkForOneIndex: function () {
    var self = this,
      pollsCollection = self.pollsCollection;

    $.each(pollsCollection.models, function (index, value) {
      if (!_.isUndefined(value.isRelatedToCurrentUrl) && value.isRelatedToCurrentUrl) {
        self.isOneIndexEmpty = false;
        return false;
      }
    });
  },
  showEmptyPoll: function () {
    var self = this;
    var partner = self.partner;

    self.$pollContainer = self.$(self.selector.pollContainerSelector);
    self.$pollContainer.html(self.getTemplate(self.tplPollContainer, self.templatesObject, {
      width: self.width,
      height: self.height,
      partner: partner,
      showHeader: self.showHeader,
      locale: self.displayLocale,
      showHeaderLogo: self.showHeaderLogo,
      headerLogo: self.headerLogo,
      headerLogoUrl: self.headerLogoRedirectUrl,
      headerTitleState: self.headerTitleState,
      widgetTitle: self.widgetTitle,
      headerTextColor: self.headerTextColor,
      headerBarColor: self.headerBarColor,
      showFooter: self.showFooter,
      isEmptyPoll: self.isEmptyPoll,
      backgroundColor: self.backgroundColor,
      backgroundTransparency: self.backgroundTransparency,
      headerTextAlignment: self.headerTextAlignment,
      enableCrowPolls: self.enableCrowPolls,
      toFriendlyNumber: toFriendlyNumber,
      hexConvert: hexConvert,
      isWhiteLabel: self.isWhiteLabel,
      headerText: self.headerText,
      showLearnMore: self.showLearnMore,
      i18n: $.i18n
    }));

    self.showBottomPanel();
  },
  setHeaderText: function () {
    var self = this;
    var partner = self.partner;
    var partnerName = '';
    var headerTitle = self.headerTitle;

    if ('custom' === self.headerTitleState) {
      self.headerText = headerTitle.replace(/<(?:.|\n)*?>/gm, '');
    }
    else {
      if (self.isWhiteLabel) {
        partnerName = partner.parentObject ? partner.parentObject.name : partner.name;
        self.headerText = $.i18n.prop('widget_holdings_header_text', partnerName);
      }
      else {
        self.headerText = $.i18n.prop('widget_default_header_text');
      }
    }
  },
  showPoll: function (data) {
    var self = this;
    var poll = self.pollsCollection.getCurrentElement();
    var voted = data && data.voted;
    var isVoted = voted || poll.get('voted');
    var partner = self.partner;

    self.$pollContainer = self.$(self.selector.pollContainerSelector);
    self.$pollContainer.html(self.getTemplate(self.tplPollContainer, self.templatesObject, {
      i18n: $.i18n,
      poll: poll,
      partner: partner,
      pollTaglineTextColor: self.pollTaglineTextColor,
      pollTaglineAlignment: self.pollTaglineAlignment,
      pollRotationArrowsColor: self.pollRotationArrowsColor,
      pollRotationBtnBgColor: self.pollRotationBtnBgColor,
      pollsNumber: self.pollsCollection.length,
      width: self.width,
      height: self.height,
      widgetCode: self.widgetCode,
      showHeader: self.showHeader,
      showHeaderLogo: self.showHeaderLogo,
      headerLogo: self.headerLogo,
      headerLogoUrl: self.headerLogoRedirectUrl,
      headerTitleState: self.headerTitleState,
      widgetTitle: self.widgetTitle,
      headerTextColor: self.headerTextColor,
      headerBarColor: self.headerBarColor,
      locale: self.displayLocale,
      location: self.location,
      showFooter: self.showFooter,
      backgroundColor: self.backgroundColor,
      headerTextAlignment: self.headerTextAlignment,
      showFBLike: self.showFBLike,
      showTwitterLike: self.showTwitterLike,
      showGooglePlusLike: self.showGooglePlusLike,
      showLinkedInLike: self.showLinkedInLike,
      showWeiboSharing: self.showWeiboSharing,
      showVkontakteSharing: self.showVkontakteSharing,
      backgroundTransparency: self.backgroundTransparency,
      enableCrowPolls: self.enableCrowPolls,
      isEmptyPoll: self.isEmptyPoll,
      toFriendlyNumber: toFriendlyNumber,
      hexConvert: hexConvert,
      isWhiteLabel: self.isWhiteLabel,
      headerText: self.headerText,
      showLearnMore: self.showLearnMore,
      isVotingPanelExpanded: self.isVotingPanelExpanded
    }));

    self.$(self.selector.taglineArea)
      .html(self.getTemplate(self.tplTaglineArea, self.templatesObject, {poll: poll, i18n: $.i18n}));

    self.$actionViewPortContainer = self.$(self.selector.actionViewPortSelector);
    self.setResponsiveHeaderText();
    self.setResponsiveTagLine();
    self.showBottomPanel({voted: isVoted});

    if (self.isFirstPollViewed) {
      self.trackPollViews(poll);
    }

    if (self.enableCrowPolls) {
      self.setCrowTagLine();
    }

    if ('closed' === poll.get('status')) {
      self.showClosedPollLabel();
    }
    else if (self.readMoreOverlayDefaultState) {
      self.showReadMoreOverlay = true;
    }
  },
  setResponsiveHeaderText: function () {
    var self = this,
      $headerContainer = self.$('.js-responsive-title');

    $headerContainer.css('max-width', self.$(self.selector.pollContainerSelector).width() - 10);
  },
  setResponsiveTagLine: function () {
    var self = this,
      taglineWrapperHeight = 80,
      fontStep = 1,
      iteration = 0,
      $tagLineElem = self.$el.find('.js-tagline-element'),
      startFontSize = $tagLineElem.offset().width < 400 ? 24 : 28,
      $pollContainer = self.$(self.selector.pollContainerSelector);

    function setNewFontSize() {
      self.setFontSize = parseInt($tagLineElem.css('font-size'));
      iteration++;

      if (_.isNull(self.responsiveTaglineContainerWidth)) self.responsiveTaglineContainerWidth = 0;
      if ($tagLineElem.height() > taglineWrapperHeight && iteration < 28) {

        $tagLineElem.css('font-size', ((parseInt($tagLineElem.css('font-size')) - fontStep)) + 'px')
          .css('line-height', ((parseInt($tagLineElem.css('font-size'))) + 4) + 'px');

        self.setFontSize = parseInt($tagLineElem.css('font-size'));
        self.responsiveTaglineContainerWidth = $pollContainer.width();
        setNewFontSize();
      }
      else if (
        self.setFontSize < startFontSize
        && self.responsiveTaglineContainerWidth < $pollContainer.width()
      ) {
        $tagLineElem
          .css('font-size', (++self.setFontSize) + 'px')
          .css('line-height', ((parseInt($tagLineElem.css('font-size'))) + 4) + 'px');

        if (self.setFontSize <= startFontSize) {
          setNewFontSize();
        }
      }
    }

    setNewFontSize();
  },
  showBottomPanel: function (data) {
    var self = this;
    var voted = data && data.voted;
    var pollsCollection = self.pollsCollection.getCurrentElement();
    var partner = self.partner;

    if (_.isUndefined(pollsCollection)) {
      pollsCollection = null;
    }

    self.isWhiteLabel = isWhiteLabelHolding(partner);

    if (self.isWhiteLabel) {
      self.partnerName = partner.parentObject ? partner.parentObject.name : partner.name;
    }

    self.$(self.selector.bottomPanelContainersSelector)
      .html(self.getTemplate(self.tplBottomPanel, self.templatesObject, {
        i18n: $.i18n,
        poll: pollsCollection,
        partner: self.partner,
        isVoted: voted,
        widgetCode: self.widgetCode,
        locale: self.displayLocale,
        partnerName: self.partnerName,
        widgetLogoState: self.widgetLogoState,
        partnerLogo: self.partnerLogo,
        widgetTitleState: self.widgetTitleState,
        widgetTitle: self.widgetTitle,
        partnerWidgetIcon: self.partnerWidgetIcon,
        showFBLike: self.showFBLike,
        showLearnMore: self.showLearnMore,
        showTwitterLike: self.showTwitterLike,
        showGooglePlusLike: self.showGooglePlusLike,
        showLinkedInLike: self.showLinkedInLike,
        showWeiboSharing: self.showWeiboSharing,
        showVkontakteSharing: self.showVkontakteSharing,
        showFooterLogoAndText: self.showFooterLogoAndText,
        isEmptyPoll: self.isEmptyPoll,
        config: App.config,
        isWhiteLabel: self.isWhiteLabel,
        frontStatic: App.config.DEBUG_MODE ?
          App.config.FRONT_STATIC_DEBUG_WIDGET
          : App.config.FRONT_STATIC,
        showUserScore: self.showUserScore,
        countOfUserScore: self.countOfUserScore || ''
      }));
  },
  getUserScore: function () {
    var self = this;

    Ajax({
      type: 'GET',
      url: App.config.URL_SERVER_API_NEW + '/account/score',
      showLoader: false,
      success: function (data) {
        if (data.score > 0) {
          self.animateScoreCount(self.selector.countOfUserScore, data.score, 100);
          self.countOfUserScore = data.score;
        }
      }
    })
  },
  animateScoreCount: function (el, score, duration) {
    var self = this;
    var interval;
    var count = self.countOfUserScore;

    if (score - count > 20) {
      self.$(el).html(score)
    } else {
      interval = setInterval(function () {
        if (count >= score) clearInterval(interval);
        self.$(el).html(count++)
      }, duration)
    }
  },
  setCrowTagLine: function () {
    var self = this,
      currentPoll = self.pollsCollection.getCurrentElement(),
      crowTagLineTpl = 'crowTaglineLink',
      $crowTaglineSelector = self.$('#tagline-crow-link'),
      $topPanelWidth = self.$(self.selector.topPanelSelector),
      getAuthor = currentPoll.get('createdBy'),
      name = getAuthor.first + ' ' + getAuthor.last,
      $authorBlock,
      $crowdBar;
    var partnerExternalId = self.partner && self.isAdmin ? self.partner.externalId : '';
    var relatedUrl = currentPoll.get('relatedUrl');
    var linkToScmCreatePoll = App.config.NEW_B2C_DOMAIN + 'scm/create-poll/'
      + partnerExternalId
      + '/?articleLink=' + relatedUrl;
    var dashboardLink = partnerExternalId ?
      '#!/admin/partners/poll-list/crowdsourced-polls/' + partnerExternalId
      : '#!/partner/poll-list/crowdsourced-polls/';

    if ($topPanelWidth.width() <= 305 || (name.length >= 19 && $topPanelWidth.width() <= 337)) {
      name = name.substring(0, 4) + ' ...';
    }

    $crowTaglineSelector.html(self.getTemplate(crowTagLineTpl, self.templatesObject, {
      i18n: $.i18n,
      name: name,
      image: getAuthor.thumbnailUrl,
      votingButtonsColor: self.votingButtonsColor,
      canManage: self.canManage,
      isCrowdPoll: currentPoll.get('crowdPoll') ?
        currentPoll.get('crowdPoll')
        : currentPoll.get('isCrowdPoll'),
      partnerExternalId: partnerExternalId,
      crowdPollStatus: currentPoll.get('crowdPollStatus'),
      dashboardLink: dashboardLink,
      linkToScmCreatePoll: linkToScmCreatePoll
    }));

    $authorBlock = self.$el.find('.js-author-crow');
    $crowdBar = self.$('.crowd-bar');

    $topPanelWidth.width() < 260 ? $authorBlock.hide() : $authorBlock.show();
    $topPanelWidth.width() < 530 ? $crowdBar.addClass('width-530') : $crowdBar.removeClass('width-530');
    $topPanelWidth.width() < 380 ? $crowdBar.addClass('width-380') : $crowdBar.removeClass('width-380');
  },
  expandVotingPanel: function () {
    var self = this;
    var $aViewport = self.$el.find('.a-viewport');
    var $buttonsSwbg = self.$(self.selector.buttonsSwbg);
    var $buttonsSwitcher = self.$(self.selector.buttonsSwitcher);
    var $buttonsSwitcherIcon = self.$(self.selector.buttonsSwitcherIcon);
    var $votingButtonsContainersSelector = self.$(self.selector.votingButtonsContainersSelector);
    var $resultOverlay = self.$(self.selector.actionsForVotedPoll).length;

    if (!self.isVotingPanelExpanded && self.votingPanelSettings.isInvisibleButtons) {
      self.isVotingPanelExpanded = true;
      $buttonsSwbg.css();
      $buttonsSwitcherIcon.addClass('expanded');
      $buttonsSwitcher.addClass('expanded');
      $votingButtonsContainersSelector.addClass('expanded');
      $aViewport.addClass('hide-tmp');

    } else if (self.isVotingPanelExpanded && !self.isVotingProcessRun || $resultOverlay) {
      $buttonsSwitcherIcon.removeClass('expanded');
      $votingButtonsContainersSelector.removeClass('expanded');
      self.isVotingPanelExpanded = false;
      $buttonsSwitcher.removeClass('expanded');
      $aViewport.removeClass('hide-tmp');
    }
  },
  shrinkVotingPanel: function () {
    var self = this;
    var $resultOverlay = self.$(self.selector.actionsForVotedPoll).length;

    if (self.isVotingPanelExpanded && !self.isVotingProcessRun || $resultOverlay) {
      self.$(self.selector.buttonsSwitcherIcon).removeClass('expanded');
      self.$(self.selector.votingButtonsContainersSelector).removeClass('expanded');
      self.isVotingPanelExpanded = false;
      self.$(self.selector.buttonsSwitcher).removeClass('expanded');
      self.$el.find('.a-viewport').removeClass('hide-tmp');
    }
  },
  calculateButtonColumnsNumber: function () {
    var self = this;
    var currentPoll = self.pollsCollection.getCurrentElement();
    var currentPollSides = currentPoll ? currentPoll.get('sides') : [];
    var isInvisibleButtons;

    if (self.pollSideTextTruncate) {
      isInvisibleButtons = currentPollSides.length > 4;
    } else {
      // TODO: use #questions-table height to see whether some text is invisible
      var questionsTableWidth = $(window).width(), // self.$('#questions-table').width(),
        allSidesLinesCount = 0;

      _.each(currentPollSides.models, function (side) {
        allSidesLinesCount += Math.ceil(10 * side.get('answer').length / questionsTableWidth);
      });

      isInvisibleButtons = allSidesLinesCount > 4;
    }

    self.votingPanelSettings = {
      poll: currentPoll,
      sides: currentPollSides,
      toFriendlyNumber: toFriendlyNumber,
      votingButtonsColor: self.votingButtonsColor,
      pollTaglineTextColor: self.pollTaglineTextColor,
      isInvisibleButtons: isInvisibleButtons,
      expanded: self.isVotingPanelExpanded,
      backgroundColor: self.backgroundColor,
      backgroundTransparency: self.backgroundTransparency,
      showVotersCount: self.showVotersCount,
      pollSideTextTruncate: self.pollSideTextTruncate,
      hexConvert: hexConvert
    };

    return false;
  },
  showClosedPollLabel: function () {
    var self = this;

    self.$(self.selector.closedPollLabelContainer).prepend(
      self.getTemplate(self.tplClosedPollLabel, self.templatesObject, {i18n: $.i18n})
    );
  },
  showVotingPanel: function () {
    var self = this;

    self.calculateButtonColumnsNumber();

    self.$actionViewPortContainer.html(self.getTemplate(self.tplVotingPanel, self.templatesObject,
      self.votingPanelSettings,
    ));

    self.appendTextEllipsisToAnswers();
    self.$(self.selector.topPanelSelector).removeClass('statisticsShown');

    Img.resizeImages();
    self.isVotingPanelActive = true;
    self.setResponsiveVotingBar();
  },
  appendTextEllipsisToAnswers: function () {
    var self = this;
    var $questionsTable;
    var questionsTableWidth;
    var questionsTableContainerWidth;
    var secondColumnWidth;

    $questionsTable = self.$('#questions-table');
    $questionsTable.removeClass('fixed-layout');
    $questionsTable.find('.js-answer').width('auto');
    $questionsTable.find('.js-votes-percentage').removeAttr('width');
    questionsTableWidth = $questionsTable.width();
    questionsTableContainerWidth = $questionsTable.parent().width();

    if (questionsTableWidth > questionsTableContainerWidth) {
      secondColumnWidth = $questionsTable.find('.js-votes-percentage:first').width() + 0;
      $questionsTable.find('.js-votes-percentage').width(secondColumnWidth);
      $questionsTable.width(questionsTableContainerWidth);
      $questionsTable.addClass('fixed-layout');
    }
  },
  setResponsiveVotingBar: function () {
    var self = this,
      widgetWidth = self.$(self.selector.pollContainerSelector).width();

    if (widgetWidth >= 470) {
      self.$('.js-widget-container').addClass('narrow-votes');
    }
    else if (widgetWidth < 470) {
      self.$('.js-widget-container').removeClass('narrow-votes');
    }

    if (!self.isPollVoted) {
      if (widgetWidth >= 730 && !self.isPollVoted) {
        self.$(self.selector.votePointer).show();
        self.$(self.selector.votePointer).css({backgroundColor: self.votingButtonsColor});
        self.$(self.selector.votePointerArrow)
          .css({borderColor: 'transparent transparent transparent ' + self.votingButtonsColor});
      }
      else {
        self.$(self.selector.votePointer).hide();
      }
    }
    else {
      self.$(self.selector.votePointer).hide();
    }
  },
  setResponsiveBranding: function () {
    var self = this,
      widgetWidth = self.$(self.selector.pollContainerSelector).width(),
      $brandTitle = self.$('.js-brand-title');

    if (widgetWidth > 299) {
      $brandTitle.show();
    }
    else {
      $brandTitle.hide();
    }
  },
  setResponsiveCrowPollContainer: function () {
    var self = this,
      $crowContainer = self.$el.find('.js-crow-responsive');

    if ($crowContainer.length) {
      if (self.headerTitleState === 'hidden') $crowContainer.addClass('header-off');
      if (!self.showFooter) $crowContainer.addClass('footer-off');
      $crowContainer.width(self.$pollContainer.width());
      self.childs.crowdsourcingPoll.childs.crowQuestionStep.updateTitle();
    }
  },
  nextPollInRotation: function () {
    var self = this,
      currentElementIndex = self.pollsCollection.currentElementIndex;

    self.isEmbedCodeShown = false;
    self.isVotingPanelExpanded = false;
    self.setFontSize = null;
    self.responsiveTaglineContainerWidth = null;
    self.isRotate = true;

    if (currentElementIndex + 1 === self.pollsCollection.length && self.requestNewPolls) {
      $.when(self.fetchNewPolls('next'), self.asyncFetch).then(function () {
        self.showNextPoll();
      });
    }
    else {
      self.showNextPoll();
    }

    if (self.adInitialized) {
      self.adUnitInPollRotationDialog.showNextPoll();
      self.trigger('refreshTopBottomJsAdUnit', 'userPrevNextAction');
      self.trigger('refreshLeftRightAdunit', 'userPrevNextAction');
    }
  },
  prevPollInRotation: function () {
    var self = this,
      currentElementIndex = self.pollsCollection.currentElementIndex;

    self.isEmbedCodeShown = false;
    self.isVotingPanelExpanded = false;
    self.setFontSize = null;
    self.responsiveTaglineContainerWidth = null;
    self.isRotate = true;

    if (currentElementIndex === 0 && self.requestNewPolls) {
      $.when(self.fetchNewPolls('prev'), self.asyncFetch).then(function () {
        self.showPrevPoll();
      });
    }
    else {
      self.showPrevPoll();
    }

    if (self.adInitialized) {
      self.trigger('refreshTopBottomJsAdUnit', 'userPrevNextAction');
      self.trigger('refreshLeftRightAdunit', 'userPrevNextAction');
    }
  },
  showReadModeContainer: function () {
    var self = this,
      poll = self.pollsCollection.getCurrentElement();

    if (
      (self.showReadMoreOverlay && !poll.isActionsForVotedPollShown && !poll.isRelatedToCurrentUrl)
      || self.showLearnMore
    ) {

      self.$(self.selector.readMoreBtn).addClass('hide');
      self.$(self.selector.readMoreContainer).addClass('visible');
      self.$el.find('.a-viewport').addClass('hide-tmp');
    }
  },
  vote: function (e) {
    var self = this,
      element = $(e.currentTarget),
      poll = self.pollsCollection.getCurrentElement();

    if ('closed' !== poll.get('status')) {
      self.isVotingProcessRun = true;
      self.isRotate = false;
      self.isPollVoted = true;
      self.voteForSide(element.data('pollSideId'), element.data('voteToken'), function () {
        self.votingCallback(self);
      });
    }

    return self;
  },
  votingCallback: function (view) {
    var self = view,
      poll = self.pollsCollection.getCurrentElement();

    if (self.showFooter && self.showUserScore) {
      self.getUserScore(self.votingCallback.bind(null, self));
    }

    poll.isActionsForVotedPollNeeded = true;

    self.showPoll({voted: true});
    self.showVotingPanel();

    self.isVotingProcessRun = false;
    self.incrementWidgetVotesCounter();
    console.log(self.childs);
    if (self.enableConversionWindow) self.childs.conversionDialog.newVote();
    if (self.adInitialized) {
      self.adUnitInPollRotationDialog.processVoting();
      self.trigger('refreshTopBottomJsAdUnit', 'userVoteAction');
      self.trigger('refreshLeftRightAdunit', 'userVoteAction');
    }
  },
  hideReadModeContainer: function () {
    var self = this;

    if (self.showReadMoreOverlay || self.showLearnMore) {
      self.$(self.selector.readMoreBtn).removeClass('hide');
      self.$(self.selector.readMoreContainer).removeClass('visible');
    }
  },
  fetchNewPolls: function (moveTo) {
    var self = this;

    self.asyncFetch = $.Deferred();
    return Ajax({
      url: App.config.URL_SERVER_API_NEW + 'poll/widget/' + self.widgetCode + '/' + self.displayLocale,
      cacheIfNoSession: true,
      type: 'GET',
      contentType: 'application/json',
      showLoader: true,
      data: {
        pageSize: self.pollsCount,
        excluded: self.excludedPolls.toString(),
        location: self.partnerPageUrl
      },
      success: function (models) {
        for (var attr in models) {
          if (models.hasOwnProperty(attr)) {
            self.excludedPolls.push(models[attr].id);
          }
        }

        switch (moveTo) {
          case 'prev':
            self.trigger('lastCollectionUpdate', models.length);
            self.pollsCollection.unshift(models.reverse(), {silent: true, remove: false});
            break;
          case 'next':
            self.trigger('lastCollectionUpdate', models.length);
            self.pollsCollection.push(models, {silent: true, remove: false});
            break;
        }

        if (models.length === 0) self.requestNewPolls = false;
        self.asyncFetch.resolve();
      }
    });
  },
  createPollsCollection: function (polls) {
    var self = this,
      pollsCollection;

    pollsCollection = smartCollection.extend({
      currentPageLink: document.createElement('a'),
      newPollsInCollection: 0,
      'model': multisidePollModel.extend({
        isRelatedToCurrentUrl: false,
        relatedUrlLink: document.createElement('a'),
        afterInitialize: function () {
          var self = this;

          self.checkRelationToUrl();
        },
        checkRelationToUrl: function () {
          var self = this;

          if (self.get('relatedUrl')) {
            self.relatedUrlLink.href = self.get('relatedUrl');

            if (self.relatedUrlLink.hostname.replace(/^(https?:\/\/)?(www\.)?/, '') ===
              self.collection.currentPageLink.hostname.replace(/^(https?:\/\/)?(www\.)?/, '') &&
              self.relatedUrlLink.pathname === self.collection.currentPageLink.pathname &&
              self.relatedUrlLink.hash === self.collection.currentPageLink.hash
            ) {
              var relatedUrlLinkSearch = self.relatedUrlLink.search;
              var currentPageLinkSearch = self.collection.currentPageLink.search;

              if (!relatedUrlLinkSearch && !currentPageLinkSearch) {
                self.isRelatedToCurrentUrl = true;
              }
              else {
                var pollLink = self.relatedUrlLink,
                  pageLink = self.collection.currentPageLink;

                if (relatedUrlLinkSearch === currentPageLinkSearch) {
                  self.isRelatedToCurrentUrl = true;
                }
                if (pageLink.href.indexOf(pollLink.hash) !== -1) {
                  self.isRelatedToCurrentUrl = true;
                }
              }
            }
          }
        }
      }),
      initialize: function (models, widgetSettings) {
        var self = this;

        self.widgetLocation = decodeURIComponent(widgetSettings.location);
        self.currentPageLink.href = self.widgetLocation;
      }
    });

    return new pollsCollection(polls, {location: self.location});
  },
  registerClickOnLearnMore: function (e) {
    var self = this,
      elem = self.$(e.currentTarget).attr('class');

    self.sendClickAction('insight_click', elem);
    e.stopPropagation();
  },
  registerClickOnReadMore: function (e) {
    var self = this,
      elem = self.$(e.currentTarget).attr('class');

    self.sendClickAction('1Index_click', elem);
    e.stopPropagation();
  },
  sendClickAction: function (event) {
    var self = this,
      eventName = event || '',
      currentPoll = self.pollsCollection.getCurrentElement();

    if (currentPoll) {
      Ajax({
        url: App.config.URL_SERVER_API_NEW + 'event-track',
        type: 'GET',
        showLoader: false,
        data: {
          sourceType: 'poller',
          sourceCode: self.widgetCode,
          poll: currentPoll.get('id'),
          event: eventName
        }
      });
    }
  },
  setCrowdStatus: function (e) {
    var self = this,
      currentPoll = self.pollsCollection.getCurrentElement(),
      currentPollId = currentPoll.id,
      $currentTarget = self.$(e.currentTarget),
      actionFor = $currentTarget.attr('action-for'),
      $statusBar = self.$('.js-crow-status-bar');

    if ($statusBar.find('.active').length > 0 &&
      $statusBar.find('.active').attr('action-for') === $currentTarget.attr('action-for')) {
      return;
    }

    self.showLoader();
    Ajax({
      url: App.config.URL_SERVER + actionFor,
      type: 'POST',
      showLoader: true,
      data: {
        'pollId': currentPollId
      },
      complete: function () {
        currentPoll.set('crowdPollStatus', actionFor === 'PollCrowdsourceApprove' ? 'approved' : 'rejected');
        self.setCrowTagLine();
        self.hideLoader();
      },
      error: function (XHttpRequest, message) {
        self.hideLoader();
        window.alert(message);
      }
    });
  },
  showConversionWindow: function () {
    var self = this;

    self.childs.conversionDialog = new conversionDialog({parent: self});
    self.childs.conversionDialog.render();
  },
  showSharing: function () {
    var self = this;

    self.$('.js-social-btns').toggleClass('show');
  }
});