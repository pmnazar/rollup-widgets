define(
    'collections/smart-collection',
    [
        'app',
        'models/poll-side-model',
        'backbone'
    ],
    function(App, pollSideModel, Backbone) {
        var smartCollection = App.Collection.defaultCollection.extend({
            url: '',
            queryParams: {},
            model: pollSideModel,
            proxiedSync: Backbone.sync,
            recalculatePercentageOfSides: function(totalVotes) {
                var sides = this,
                    sumPercentage = 0,
                    lastVotedSideIndex = 0,
                    lastVotedSide,
                    votesPercent,
                    delta;

                sides.each(function(side, i) {
                    votesPercent = 0 !== totalVotes ? parseInt((side.get('votes') * 100 / totalVotes).toFixed()) : 0;
                    side.set({votesPercent: votesPercent});
                    sumPercentage += side.get('votesPercent');

                    if (side.get('votes')) {
                        lastVotedSideIndex = i;
                    }
                });

                delta = (0 !== totalVotes) ? 100 - sumPercentage : 0;
                lastVotedSide = sides.at(lastVotedSideIndex);
                lastVotedSide.set({votesPercent: lastVotedSide.get('votesPercent') + delta});
            },
            getColorsArray: function() {
                var self = this,
                    result = [];

                self.each(function(model) {
                    result.push(model.get('sideColor'));
                });

                return result;
            },
            getPrevElementIndex: function(lastModelLength) {
                var self = this,
                    prevIndex;

                if (self.currentElementIndex === 0) {
                    if (lastModelLength > 0) {
                        prevIndex = lastModelLength - 1;
                    }
                    else {
                        prevIndex = self.length - 1;   
                    }
                }
                else {
                    prevIndex = self.currentElementIndex - 1;
                }

                return prevIndex;
            },
            prev: function() {
                var self = this,
                    lastModelLength = self.newPollsInCollection;

                self.currentElementIndex = self.getPrevElementIndex(lastModelLength);
                return self.at(self.currentElementIndex);
            },
            fetch: function (options) {
                var collectionSettings = {
                    silent: true, remove: false
                };
                options = options || {};

                var data = options.data || {};
                var url = options.url || this.url || '';
                var contentType = options.contentType || '';
                var BBColProto = Backbone.Collection.prototype;
                var callBack = options.callback;

                options.url = url;
                options.data = data;
                options.contentType = contentType;
                options.dataType = 'json';

                var success = options.success;
                var queryParamsArray = _.pairs(this.queryParams);
                var qParamLength = queryParamsArray.length;

                for (var i = 0; i < qParamLength; i++) {
                    var param = queryParamsArray[i];
                    options.data[param[0]] = param[1];
                }

                if (options.showLoader)  {
                    $('#loaderDiv').show();
                }

                options.success = function (col, resp, opts) {
                    // make sure the caller's intent is obeyed
                    opts = opts || {};

                    if (_.isUndefined(options.silent)) delete opts.silent;
                    else opts.silent = options.silent;

                    if (success) success(col, resp, opts);
                    $('#loaderDiv').hide();
                };

                return BBColProto.fetch.call(this, _.extend({}, options, collectionSettings));
            },
            sync: function(method, model, options) {
                options || (options = {});

                if (!options.crossDomain) {
                    options.crossDomain = true;
                }

                if (!options.withCredentials) {
                    options.beforeSend = function(xhr) {
                        xhr.withCredentials = true;
                    };
                }

                return this.proxiedSync(method, model, options);
            }
        });
        
        return smartCollection;
    }
);