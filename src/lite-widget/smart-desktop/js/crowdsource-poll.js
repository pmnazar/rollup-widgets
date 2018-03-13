define(
    'smart-desktop/js/crowdsource-poll',
    [
        'app',
        'helpers/auth/social-auth',
        'helpers/forms/parseForm',
        'text!templates/crowdsource-poll.tpl',
        'helpers/ajax/ajax-wrapper'
    ],
    function(App, authBySoc, Form, tpl, Ajax) {
        var crowdDefaultView = App.View.defaultView.extend({
            el: '#pollContainer',
            conversionDialog: '.conversionDialog',
            isUserAuth: false,
            crowDataCollection : {},
            createdPollObject: {},
            crowArticleImage: {},
            childs: {},
            parentLocation: null,
            isPollAdded: false,
            defaultRules: {
                'crowdsource': {
                    checkForRequired: true,
                    checkForLength: 100
                }
            },
            selectors: {
                crowStepWrapper: '.crowdsource-wrapper',
                widgetContainer: '.js-widget-container',
                relativeCrowdWrapper: '.js-relative-crow-wrapper',
                responsiveCrowPollContainer: '.js-crow-responsive'
            },
            template: {
                crowStepWrapperTpl: 'crowStepWrapper',
                conversionDialogTpl: 'conversionDialog'
            },
            events: {
                'click .js-start-crow-poll' : 'startCrowPoll',
                'click #modalClose' : 'closeDialog'
            },
            onInitialize: function() {
                var self = this;

                self.templatesObject = self.prepareTpl(tpl);
                self.parentLocation = self.parent.partnerPageUrl;
                self.parent.isCrowdInitialized = true;
                self.initChilds();
            },
            initChilds: function() {
                var self = this;

                self.childs.crowQuestionStep = new crowQuestionStep({ parent: self });
                self.childs.crowOptionsStep = new crowOptionsStep({ parent: self });
                self.childs.crowSharingStep = new crowSharingStep({ parent: self });
                self.childs.crowRegStep = new crowRegStep({ parent: self });
            },
            checkUserAuth: function() {
                var self = this;

                if (authBySoc.hasAccess('synthetic')) {
                    self.isUserAuth = true;
                }
                else {
                    self.isUserAuth = false;
                }

                return self.isUserAuth;
            },
            startCrowPoll: function() {
                var self = this;
                    self.isPollAdded = false;

                // self.stopPollRotation();
                // self.addWrapper();
                // self.childs.crowQuestionStep.showDialog();
            },
            stopPollRotation: function() {
                var self = this;

                self.parent.isVotingPanelActive = false;
                self.parent.stopRotation();
            },
            getArticleImage: function() {
                var self = this;

                Ajax({
                    url: App.config.URL_SERVER + 'ImageAttachmentGrabOGImage',
                    type: 'POST',
                    data: {
                        url: self.parentLocation
                    },
                    success: function(response) {
                        if (response['@type'] !== 'com.oneworldonline.backend.apiresults.Error') {
                            self.crowArticleImage = {
                                guid: response.guid,
                                type: response.type,
                                url:  response.url
                            };
                        }
                    }
                });
            },
            addWrapper: function() {
                var self = this,
                    $closeBtn;

                if (self.parent.$el.find(self.conversionDialog).length) {
                    self.parent.$el.find(self.conversionDialog).remove();
                }

                self.parent.$el.find(self.selectors.relativeCrowdWrapper)
                    .append(self.getTemplate(self.template.conversionDialogTpl, self.templatesObject));

                self.parent.$el.find(self.conversionDialog).css({ 'display': 'block', 'width': self.$el.width() })
                    .append(self.getTemplate(self.template.crowStepWrapperTpl, self.templatesObject));

                if (self.parent.headerTitleState === 'hidden') {
                    self.$(self.selectors.responsiveCrowPollContainer).addClass('header-off');
                }

                if (!self.parent.showFooter) {
                    self.$(self.selectors.responsiveCrowPollContainer).addClass('footer-off');
                }

                if (self.parent.isEmptyPoll) {
                    $closeBtn = self.$el.find('#modalClose');
                    $closeBtn.hide();
                }
            },
            closeDialog: function() {
                var self = this;

                self.parent.$el.find(self.conversionDialog).remove();

                if (self.isPollAdded) {
                    self.childs.crowSharingStep.showPollInRotation();
                }
                else {
                    self.crowDataCollection = {};
                }
            },
            validateForm: function(elem, rules, formCallback) {
                var self = this,
                    formElem = self.parent.$(elem).find('input'),
                    formRules = _.isEmpty(rules) ? self.defaultRules : rules,
                    isValid = false,
                    validateResults = [],
                    validateTpl = 'validateErrors';

                function checkForDuplicate(elem, ruleValue) {
                    var errorClass = getClassNameForInput(elem),
                        isNoDuplicates = true,
                        $selector = self.$('[name^=opinion]');

                    var dupElement = $selector.filter(function() {
                        return elem.val() === this.value && elem.attr('name') !== $(this).attr('name') && elem.val() !== '';
                    });

                    if ($(dupElement).length) {
                        if (self.$el.find('.' + errorClass).length) {
                            self.$el.find('.' + errorClass).remove();
                        }
                        renderError(elem, {
                            name: elem.attr('name'),
                            errorClassName: errorClass,
                            errMsg: $.i18n.prop('widget_default_crow_error_duplicate')
                        });

                        isNoDuplicates = false;
                    }
                    else if (_.isUndefined(dupElement) || elem.val() === '') {
                        if (self.$el.find('.' + errorClass).length) {
                            self.$el.find('.' + errorClass).remove();
                        }

                        isNoDuplicates = true;
                    }

                    return isNoDuplicates;
                }

                function checkForRequired(elem, ruleValue) {
                    var errorClass = getClassNameForInput(elem),
                        isValidate = false;

                    if (elem.val() === '' && ruleValue) {
                        if (self.$el.find('.' + errorClass).length) {
                            self.$el.find('.' + errorClass).remove();
                        }
                        renderError(elem, {
                            name: elem.attr('name'),
                            errorClassName: errorClass,
                            errMsg: $.i18n.prop('widget_default_crow_error_required')
                        });

                        isValidate = false;
                    }
                    else {
                        self.$el.find('.' + errorClass).remove();
                        isValidate = true;
                    }

                    return isValidate;
                }

                function checkForLength(elem, ruleValue) {
                    var errorClass = getClassNameForInput(elem),
                        isValidate = false,
                        errorMsg = $.i18n.prop('widget_default_crow_error_length') + ' ' + ruleValue + ' ' + $.i18n.prop('widget_default_crow_error_characters');

                    if (elem.val().length > ruleValue) {
                        if (self.$el.find('.' + errorClass).length) {
                            self.$el.find('.' + errorClass).remove();
                        }
                        renderError(elem, {
                            name: elem.attr('name'),
                            errorClassName: errorClass,
                            errMsg: errorMsg
                        });

                        isValidate = false;
                    }
                    else {
                        self.$el.find('.' + errorClass).remove();
                        isValidate = true;
                    }

                    return isValidate;
                }

                function getClassNameForInput(elem) {
                    var errorClass = 'js-' + elem.attr('name').split('.')[0];

                    if(elem.attr('name').split('.')[0] !== 'crowdsource') {
                        var errorClassForOpinion = elem.attr('name').split(/[^a-zA-Z0-9_-]/);
                        errorClass = 'js-' + errorClassForOpinion[0] + errorClassForOpinion[1];
                    }

                    return errorClass;
                }

                function renderError(elem, tplProp) {
                    var errorClass = getClassNameForInput(elem);

                    if (!self.$el.find('.' + errorClass).length) {
                        elem.after(self.getTemplate(validateTpl, self.templatesObject, {
                            name: tplProp.name,
                            errorClassName: tplProp.errorClassName,
                            errMsg: tplProp.errMsg
                        }));
                    }
                }

                if (self.parent.$(elem).length) {
                    var inputCounter = 0,
                        inputLength = self.parent.$(elem).find('input').filter('.js-required').length;
                        validateResults = [];

                    $.each(formElem, function(index, input) {
                        if ($(input).hasClass('js-required')) {
                            inputCounter++;
                        $.each(formRules, function(index, rule) {
                                var ruleLength = _.size(rule),
                                    ruleCounter = 0;
                                $.each(rule, function(ruleName, value) {
                                    var isCollectionValid;

                                    switch (ruleName) {
                                        case 'checkForDuplicate':
                                            isValid = checkForDuplicate($(input), value);
                                        break;

                                        case 'checkForRequired':
                                            isValid = checkForRequired($(input), value);
                                        break;

                                        case 'checkForLength':
                                            isValid = checkForLength($(input), value);
                                        break;
                                    }
                                    ruleCounter++;

                                    validateResults.push(isValid ? { input: 'valid' } : { input: 'notValid' });
                                    isCollectionValid = _.find(validateResults, function(value) {
                                        if (value.input === 'notValid') {
                                            return true;
                                        }
                                    });

                                    if (isValid && ruleCounter === ruleLength && inputCounter === inputLength && _.isUndefined(isCollectionValid)) {
                                        $(input).removeClass('error');
                                        formCallback();
                                    }
                                    else {
                                        $(input).addClass('error');
                                    }

                                    return isValid;
                                });
                            });
                        }
                    });
                }
            }
        });

        var crowQuestionStep = App.View.defaultView.extend({
            el: '#body',
            resizeEvent: null,
            template: 'crowQuestionStep',
            formId: '#question-form',
            events: {
                'click #submit-question': 'submitForm'
            },
            showDialog: function() {
                var self = this;

                self.$el.find(self.parent.selectors.crowStepWrapper).html(self.getTemplate(self.template, self.parent.templatesObject, {
                    formData: self.parent.crowDataCollection,
                    elementColor: self.parent.votingButtonsColor,
                    widgetWidth: self.parent.$el[0].offsetWidth
                }));

                self.updateTitle();

                self.resizeEvent = window.addEventListener('resize', _.debounce(function() {
                    self.updateViewElement();
                }, 200), true);
            },
            updateTitle: function() {
                var self = this,
                    $title = self.$('.js-ask-title'),
                    height = Math.ceil(($title.parent().width() - 45) / 12);

                if (height > 45) {
                    height = 45;
                }

                function responsiveTitle(maxFontSize, recursionState) {
                    var fontSize = parseInt($title.css('font-size')),
                        state = recursionState || { inc: true, dec: true };

                    if ($title.parent().height() > height && state.dec) {
                        $title.css('font-size', fontSize - 1);
                        state.inc = false;
                        responsiveTitle(maxFontSize, state);
                    }
                    else if ($title.parent().height() < height && state.inc) {
                        if ((fontSize + 1) < maxFontSize) {
                            $title.css('font-size', fontSize + 1);
                            state.dec = false;
                            responsiveTitle(maxFontSize, state);
                        }
                    }
                }

                responsiveTitle(34);
            },
            updateViewElement: function() {
                var self = this,
                    minimalWidgetHeight = 300,
                    $responsiveElement = self.$('.js-responsive-element');

                if (self.parent.$el.height() <= minimalWidgetHeight) {
                    $responsiveElement.hide();
                }
            },
            submitForm: function(e) {
                var self = this,
                    formCallback,
                    rules = {
                        'crowdsource.tagline': {
                            checkForRequired: true,
                            checkForLength: 100
                        }
                    };

                e.preventDefault();
                formCallback = function collectFormData() {
                    var formData = Form.inputToObject('question-form');
                    self.parent.crowDataCollection = _.extend(self.parent.crowDataCollection, formData);
                    self.parent.childs.crowOptionsStep.showDialog();
                };
                self.parent.validateForm(self.formId, rules, formCallback);
            }
        });

        var crowOptionsStep = App.View.defaultView.extend({
            el: '#body',
            template: 'crowOptionsStep',
            formId: '#options-form',
            optionCount: 10,
            defaultPollCount: 3,
            minimalOptionCount: 2,
            events: {
                'click .js-to-prev-link': 'goToPrevStep',
                'click .js-change-count': 'changePollCount',
                'click #submit-poll-opinion': 'submitForm'

            },
            showDialog: function() {
                var self = this;

                self.$el.find(self.parent.selectors.crowStepWrapper).html(self.getTemplate(self.template, self.parent.templatesObject, {
                    defaultPollCount: self.defaultPollCount,
                    formData: self.parent.crowDataCollection,
                    elementColor: self.parent.parent.votingButtonsColor
                }));

                self.parent.getArticleImage();
            },
            goToPrevStep: function() {
                var self = this,
                    formData = Form.inputToObject('options-form'),
                    opinion = {list:[]};

                $.each(formData, function(index, value) {
                    if (index !== 'crowdsource') {
                        opinion.list.push({
                            'answerLabel': value
                        });
                    }
                });

                self.checkAdditionalInput();

                self.parent.crowDataCollection = _.extend(self.parent.crowDataCollection, opinion);
                self.parent.childs.crowQuestionStep.showDialog();
            },
            changePollCount: function(e) {
                var self = this,
                    element = e.currentTarget,
                    data = self.$(element).attr('data'),
                    $optionContainer = self.$el.find('.options-wrapper'),
                    $pollOption = self.$el.find('.js-poll-option'),
                    $wrappedPollOption = $optionContainer.find('.js-poll-option');

                switch (data) {
                    case 'inc-count':
                        if (self.defaultPollCount < self.optionCount) {
                            $optionContainer.append($pollOption.first().clone().val('').attr('name', 'opinion[' + self.defaultPollCount + ']'));

                            self.defaultPollCount++;
                            self.updateCounter(self.defaultPollCount);
                        }

                    break;

                    case 'dec-count':
                        if (self.defaultPollCount > self.minimalOptionCount) {
                            $wrappedPollOption.last().next().remove();
                            $wrappedPollOption.last().remove();

                            self.defaultPollCount--;
                            self.updateCounter(self.defaultPollCount);
                        }

                    break;
                }
            },
            updateCounter: function(count) {
                var self = this;

                self.$('#total_count').val(count);
            },
            checkAdditionalInput: function() {
                var self = this;

                $(self.formId).find('input').each(function(index, value) {
                    if ($(value).attr('name') !== undefined && $(value).attr('name').split('.')[0] === 'crowdsource') {
                        var inputValue;

                        if ($(value).attr('type') === 'checkbox') {
                            inputValue = $(value).is(":checked");
                            self.parent.crowDataCollection.crowdsource[$(value).attr('name').split('.')[1]] = inputValue;
                        }
                        else {
                            inputValue = $(value).val();
                            self.parent.crowDataCollection.crowdsource[$(value).attr('name').split('.')[1]] = inputValue;
                        }
                    }
                });
            },
            submitForm: function(e) {
                var self = this,
                    formCallback,
                    rules = {
                        'crowdsource.opinion': {
                            checkForDuplicate: true,
                            checkForRequired: true,
                            checkForLength: 60
                        }
                    };

                e.preventDefault();
                formCallback = function collectFormData() {
                    var formData = Form.inputToObject('options-form'),
                        opinion = {list:[]};

                    function prepareSidesElement() {
                        $.each(formData, function(index, value) {
                            if (index !== 'crowdsource') {
                                opinion.list.push({
                                    'answerLabel': value
                                });
                            }
                        });

                        self.checkAdditionalInput();
                    }

                    prepareSidesElement();

                    if(!_.isEqual(self.parent.crowDataCollection.opinion, opinion)) {
                        self.parent.crowDataCollection = _.extend(self.parent.crowDataCollection, opinion);
                    }

                    if (!self.parent.checkUserAuth()) {
                        self.parent.childs.crowRegStep.showDialog();
                    }
                    else {
                        self.parent.showLoader();
                        self.createNewCrowPoll();
                    }
                };

                self.parent.validateForm(self.formId, rules, formCallback);
            },
            createNewCrowPoll: function() {
                var self = this;

                Ajax({
                    url: App.config.URL_SERVER + 'PollCrowdsourceCreate',
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        'poll': {
                            image: self.parent.crowArticleImage,
                            tagLine: self.parent.crowDataCollection.crowdsource.tagline,
                            sides: self.parent.crowDataCollection.list
                        },
                        widgetCode: self.parent.parent.widgetCode,
                        pageUrl: self.parent.parentLocation,
                        askForApproval: self.parent.crowDataCollection.crowdsource.forPartner
                    }),
                    success: function(response) {
                        self.parent.createdPollObject = response;
                        self.parent.createdPollObject = _.extend(self.parent.createdPollObject, {
                            isCrowdPoll: true,
                            crowdPollStatus: 'none'
                        });

                        self.parent.crowDataCollection = {};
                        self.parent.childs.crowSharingStep.showDialog();
                        self.parent.hideLoader();
                    },
                    error: function(response) {
                        self.parent.hideLoader();
                        alert(response.message);
                    }
                });
            }
        });

        var crowSharingStep = App.View.defaultView.extend({
            el: '#body',
            template: 'crowSharingStep',
            events: {
                'click .js-create-new-poll': 'createNewPoll',
                'click .js-show-my-poll': 'showPollInRotation',

                'click .js-fb-share-uniq': 'fbShare',
                'click .js-tw-share-uniq': 'twitterShare',
                'click .js-gplus-share-uniq': 'gPlusOneShare',
                'click .js-linked-in-share-uniq': 'linkedInShare',
                'click .js-vk-share-uniq': 'vkShare'
            },
            showDialog: function() {
                var self = this,
                    $closeBtn = self.parent.$el.find('#modalClose');

                self.$el.find(self.parent.selectors.crowStepWrapper).html(self.getTemplate(self.template, self.parent.templatesObject, {
                    elementColor: self.parent.parent.votingButtonsColor,
                    showFBLike: self.parent.parent.showFBLike,
                    showTwitterLike: self.parent.parent.showTwitterLike,
                    showGooglePlusLike: self.parent.parent.showGooglePlusLike,
                    showLinkedInLike: self.parent.parent.showLinkedInLike,
                    showVkontakteSharing: self.parent.parent.showVkontakteSharing
                }));

                self.addCrowPollInCollection();
                self.parent.isPollAdded = true;
                $closeBtn.show();
            },
            addCrowPollInCollection: function() {
                var self = this,
                    newPollIndex,
                    pollsCollection = self.parent.parent.pollsCollection,
                    getNextPollIndex = pollsCollection.getNextElementIndex(),
                    getCurrentPollIndex = pollsCollection.currentElementIndex;

                    if ((getCurrentPollIndex !== 0 && getNextPollIndex === 0) || (getCurrentPollIndex === 0 && getNextPollIndex === 0)) {
                        newPollIndex = getCurrentPollIndex + 1;
                    }
                    else {
                        newPollIndex = getNextPollIndex;
                    }

                    pollsCollection.add(self.parent.createdPollObject, { at: newPollIndex });
            },
            createNewPoll: function() {
                var self = this;

                self.parent.crowDataCollection = {};
                self.parent.childs.crowQuestionStep.showDialog();
            },
            showPollInRotation: function() {
                var self = this;
                    self.parent.crowDataCollection = {};

                if (self.parent.parent.isEmptyPoll) {
                    self.parent.parent.isEmptyPoll = false;
                    self.parent.parent.render();
                }
                else {
                    self.parent.parent.showNextPoll();
                }
            },
            fbShare: function() {
                var self = this,
                    serviceUrl = 'https://www.facebook.com/sharer/sharer.php?u=';

                self.openShareWindow(serviceUrl);
            },
            twitterShare: function() {
                var self = this,
                    serviceUrl = 'https://twitter.com/intent/tweet?url=';

                self.openShareWindow(serviceUrl);
            },
            gPlusOneShare: function(e) {
                var self = this,
                    serviceUrl = 'https://plus.google.com/share?url=';

                self.openShareWindow(serviceUrl);
            },
            linkedInShare: function() {
                var self = this,
                    serviceUrl = 'https://www.linkedin.com/shareArticle?mini=true&url=';

                self.openShareWindow(serviceUrl);
            },
            vkShare: function() {
                var self = this,
                    serviceUrl = 'http://vk.com/share.php?url=';

                self.openShareWindow(serviceUrl);
            },
            openShareWindow: function(serviceUrl) {
                var self = this;

                window.open(
                    serviceUrl + encodeURIComponent(self.parent.createdPollObject.urlForSharing),
                    '',
                    'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600'
                );
            }
        });

        var crowRegStep = App.View.defaultView.extend({
            el: '#body',
            template: 'crowRegStep',
            events: {
                'click .js-back-to-option-step': 'backToOptionStep',
                'click .js-crowd-auth': 'socAuth'
            },
            showDialog: function() {
                var self = this;

                self.parent.$(self.parent.selectors.crowStepWrapper).html(self.getTemplate(self.template, self.parent.templatesObject, {
                    elementColor: self.parent.parent.votingButtonsColor
                }));
            },
            backToOptionStep: function() {
                var self = this;

                self.parent.childs.crowOptionsStep.showDialog();
            },
            socAuth: function(event) {
                var self = this,
                    authBy = self.$(event.currentTarget).attr('data-soc');

                authBySoc.tryAuth(authBy, { func: self.socialLoginSuccess, context: self });
            },
            socialLoginSuccess: function() {
                var self = this;

                self.parent.isUserAuth = true;
                self.parent.childs.crowOptionsStep.createNewCrowPoll();
            }
        });

        return crowdDefaultView;
    });