define(
    'insight-poll-stats-by-category-controls',
    [
        'app',
        'default',
        'helpers/auth/social-auth',
        'helpers/settings/account'
    ],
    function (App, DefaultView, AuthBySoc, Account) {
        var ProfileUpdateSection = DefaultView.extend({
            el: '.js-new-account-section',
            template: 'tplNewAccountSection',
            insightLocale: '',
            emptyField: '',
            isInited: false,
            profileFieldsEn: ['gender', 'maritalStatus', 'dateOfBirth', 'education2', 'politicalAffiliation', 'income'],
            profileFieldsAny: ['gender', 'maritalStatus', 'dateOfBirth'],
            selectors: {
                newAccountSection: '.js-new-account-section',
                pollStatsSection: '.js-insight-poll-stats-section',
                questionString: '.js-question-string',
                answersSection: '.js-answers',
                submitBtn: '.js-submit-btn',
                navSection: '.poll-statcs'
            },
            questionByEmptyField: {
                gender: 'Which gender do you identify with most',
                age: 'What is your date of birth',
                maritalStatus: 'What is your marital status',
                education: 'What is the highest level of education you have completed',
                income: 'What is your approximate yearly household income',
                politicalAffiliation: 'What is your political affiliation'
            },
            dataToSend: {
                key: '',
                value: '',
                accountId: ''
            },
            events: {
                'click .js-soc-auth': 'socAuth',
                'click .js-submit-btn': 'onSubmit',
                'change .js-answers': 'onChangeOption'
            },
            api: {
                getAccount: App.config.URL_SERVER_API_NEW + 'account?convertType=full',
                updateAccount: App.config.URL_SERVER_API_NEW + 'account'
            },
            onInitialize: function() {
                var self = this;

                self.dPollStatsFetched = $.Deferred();

                self.initListeners();
                self.showProfileUpdate();
            },
            initListeners: function() {
                var self = this;

                self.listenTo(self.parent, 'pollStatsReceived', function(pollStats) {
                    self.dPollStatsFetched.resolve(pollStats);
                });
                self.listenTo(self.parent.parent, 'voteUpdated', function() {
                    if (self.isInited) {
                        self.showProfileUpdate();
                    }
                });
            },
            renderProfileUpdate: function(emptyField) {
                var self = this,
                    isAge = false,
                    question = emptyField,
                    answers, currentYear;

                self.dataToSend.key = question;

                if (emptyField === 'education2') {
                    question = 'education';
                }

                if (question === 'dateOfBirth') {
                    isAge = true;
                    question = 'age';
                    currentYear = new Date().getFullYear();
                }

                answers = Account()[question];

                question = self.questionByEmptyField[question];

                self.$el.html(self.getTemplate(self.template, self.templatesObject, {
                    insightLocale: self.insightLocale,
                    currentYear: currentYear,
                    question: question,
                    answers: answers,
                    isAge: isAge
                }));

                self.isInited = true;
                self.showPollStats(false);
            },
            showProfileUpdate: function() {
                var self = this,
                    notMember, isEmptyField, isNotMaritalVote;

                self.getAccountData().then(function(account) {
                    self.dPollStatsFetched.then(function(pollStatsData) {
                        isNotMember = !_.isEmpty(account) && account.roles.indexOf('member') === -1;
                        isEmptyField = self.isEmptyFieldByLocale(account);
                        isNotMaritalVote = self.isNotMaritalStatusVote(pollStatsData);

                        if (isNotMember && isEmptyField && isNotMaritalVote) {
                            self.dataToSend.accountId = account.id;
                            self.renderProfileUpdate(self.emptyField);
                        }
                        else {
                            self.isInited = false;
                        }
                    });
                }, function(account) {
                    self.renderProfileUpdate(self.profileFieldsEn[0]);
                });
            },
            isEmptyFieldByLocale: function(accountData) {
                var self = this;

                if (self.insightLocale === 'en') {
                    return _.some(self.profileFieldsEn, function(field) {
                        self.emptyField = field;
                        return accountData[field] === undefined || null;
                    });
                }
                else {
                    return _.some(self.profileFieldsAny, function(field) {
                        self.emptyField = field;
                        return accountData[field] === undefined || null;
                    });
                }
            },
            isNotMaritalStatusVote: function(pollStats) {
                var self = this,
                    maritalVoteValues = _.values(pollStats.maritalStatus.pies.married).concat(_.values(pollStats.maritalStatus.pies.single));

                return _.some(maritalVoteValues, function(value) {return value === 0;});
            },
            showPollStats: function(state) {
                var self = this,
                    $newAccountEl = self.parent.$(self.selectors.newAccountSection),
                    $statsEl = self.parent.$(self.selectors.pollStatsSection),
                    $navEl = self.parent.parent.$(self.selectors.navSection);

                if (state) {
                    $newAccountEl.hide();
                    $statsEl.show();
                    $navEl.attr('href', '#' + $statsEl.attr('id'));
                }
                else {
                    $statsEl.hide();
                    $newAccountEl.show();
                    $navEl.attr('href', '#' + $newAccountEl.attr('id'));
                }
            },
            socAuth: function(event) {
                var self = this,
                    authBy = self.$(event.currentTarget).attr('data-soc');

                AuthBySoc.tryAuth(authBy, {
                    func: function() {
                        self.showPollStats(true);
                    },
                    context: self
                });
            },
            onChangeOption: function(event) {
                var self = this,
                    value = event.target.value,
                    submitBtn = self.$(self.selectors.submitBtn)[0];

                if (value) {
                    self.dataToSend.value = value;
                    submitBtn.classList.toggle('dsbl', false);
                }
                else {
                    submitBtn.classList.toggle('dsbl', true);
                }
            },
            onSubmit: function() {
                var self = this;

                self.updateAccount(self.dataToSend.key, self.dataToSend.value, self.dataToSend.accountId).then(function() {
                    self.showPollStats(true);
                }, function() {
                    alert('Please vote to see Statistics and True Identity');
                });
            },
            getAccountData: function() {
                var self = this;

                return self.ajax({
                    type: 'GET',
                    url: self.api.getAccount,
                    showLoader: false
                });
            },
            updateAccount: function(key, value, id) {
                var self = this,
                    queryString = '/' + id + '/' + self.keyToQueryString(key),
                    dataToUpdate = {};

                if (key === 'dateOfBirth') {
                    value = self.getTimeStampIncludesOffset(new Date(value, 0, 1));
                }

                dataToUpdate[key] = value;

                return self.ajax({
                    type: 'PUT',
                    url: self.api.updateAccount + queryString,
                    showLoader: false,
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(dataToUpdate)
                });
            },
            keyToQueryString: function(key) {
                var self = this,
                    mapObj = {
                        politicalAffiliation: 'political-affiliation',
                        maritalStatus: 'marital-status',
                        dateOfBirth: 'date-of-birth',
                        education2: 'education',
                        gender: 'gender',
                        income: 'income'
                    };

                return mapObj[key];
            },
            getTimeStampIncludesOffset: function(date) {
                return  date.getTime() + date.getTimezoneOffset() * -1 *60000;
            }
        });

        return ProfileUpdateSection;
    }
);