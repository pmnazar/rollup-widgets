define(
    'default',
    [
        'app',
        'helpers/ajax/ajax-wrapper'
    ],
    function (App, Ajax) {
        var widgetMainView = App.View.defaultView.extend({
            el: '#body',
            sectionLoaderSelector: '.js-section-loader',
            childs: {},
            initialize: function() {
                var self = this;

                if (arguments.length && typeof arguments[0] === 'object') {
                    _.extend(self, arguments[0]);   
                }

                self.onInitialize.apply(this, arguments);
            },
            onInitialize: function() {
                //abstract method
            },
            render: function() {
                var self = this;

                self.onRender();
            },
            onRender: function() {
                //abstract method
            },
            showSectionLoader: function() {
                var self = this;

                self.$(self.sectionLoaderSelector).show();
            },
            hideSectionLoader: function() {
                var self = this;

                self.$(self.sectionLoaderSelector).hide();
            },
            ajax: function(config) {
                var self = this,
                    deferred = new $.Deferred(),
                    onResponse = {
                        success: function(insight) {
                            if (config.onSuccess && typeof config.onSuccess == 'function') {
                                config.onSuccess(insight);
                                deferred.resolve(insight);
                            }
                            else {
                                deferred.resolve(insight);
                            }
                        },
                        error: function() {
                            if (config.onError && typeof config.onError == 'function') {
                                config.onError(arguments);
                                deferred.reject(arguments);
                            }
                            else {
                                deferred.reject(arguments);
                            }
                        }
                    },
                    options = _.extend({}, config || {}, onResponse);

                Ajax(options);

                return deferred;
            },
            removeView: function() {
                this.undelegateEvents();
                this.stopListening();
                this.$el.empty();
            }
        });

        return widgetMainView;
    }
);
