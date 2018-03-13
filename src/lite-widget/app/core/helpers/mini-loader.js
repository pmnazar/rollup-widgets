define(
    'helpers/mini-loader',
    [
        'jquery'
    ],
    function($) {
        var setOfClasses = '> .js-loader-hide-container.loaderContainer.loaderIcon',
            container,
            miniLoader = {};

        miniLoader.show = function(viewOrString) {
            var currentMiniLoader;

            if (viewOrString) {
                container = typeof viewOrString === 'string' ? $(viewOrString) : viewOrString.$el;
                container.toggleClass('relative-loader', true);
                currentMiniLoader = container.find(setOfClasses);
                if (currentMiniLoader.length) {
                    currentMiniLoader.toggleClass('hide', false);
                } else {
                    container.prepend('<div class="js-loader-hide-container loaderContainer loaderIcon"></div>');
                }
                showHideOthers(true);
            }

            return this;
        };
        miniLoader.hide = function(viewOrString) {
            if (viewOrString) {
                container = typeof viewOrString === 'string' ? $(viewOrString) : viewOrString.$el;
            }
            if (container && container.length) {
                container.toggleClass('relative-loader', false);
                container.find(setOfClasses).toggleClass('hide', true);
                showHideOthers(false);
            }

            return this;
        };

        return miniLoader;

        function showHideOthers(hide) {
            // Keep in mind that miniLoader container should always be the first kid
            container.children().slice(1).toggleClass('hide', hide);
        }
    }
);