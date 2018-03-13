define(
    'helpers/images',
    [
        'app',
        'settings/responsive-images',
    ],
    function(App, responsiveImages) {
        var helper = {};

        var responsiveImageTypes = Object.keys(responsiveImages);
        var selectorsPrefix = '.responsive-';
        var responsiveImageClasses = _.map(responsiveImageTypes, function(key) {
            return selectorsPrefix + key;
        });

        helper.responsiveImagesSelector = responsiveImageClasses.join(', ');

        /*
         * Make images responsible.
         *
         * @example
         * <div class="responsive-image" data-image-type="poll-image" data-image-src="http://path/to/original/image">&nbsp;</div>
         * <img class="responsive-image" data-image-type="poll-image" data-image-src="http://path/to/original/image" />
         *
         */

        helper.resizeImages = function() {
            _.each($(helper.responsiveImagesSelector), function(element, index) {
                var $element = $(element),
                    imageType = '',
                    currentImageWidth = $element.data('imageWidth'),
                    currentImageHeight = $element.data('imageHeight');

                for (var i = 0; i < responsiveImageClasses.length; i++) {
                    if ($element.is(responsiveImageClasses[i])) {
                        imageType = responsiveImageClasses[i].replace(selectorsPrefix, '');
                        break;
                    }
                }
                
                var availableResolutions = responsiveImages[imageType];
                var optimalResolution = getOptimalResolution(availableResolutions, $element);
                var imageSrc = $element.data('imageSrc');

                if ((currentImageWidth !== optimalResolution.width || currentImageHeight !== optimalResolution.height) && 'undefined' !== imageSrc) {
                    var src = imageSrc + '-' + optimalResolution.width + 'x' + optimalResolution.height;
                    if ($element.is('img')) {
                        $element.attr('src', src);
                    }
                    else {
                        $element.css({
                            backgroundImage: 'url("' + src + '")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        });
                    }
                    $element.data('imageWidth', optimalResolution.width);
                    $element.data('imageHeight', optimalResolution.height);
                }
            });
        };

        var getDistance = function(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        };

        var getOptimalResolution = function(availableResolutions, $element) {
            var requiredWidth = $element.width(),
                requiredHeight = $element.height(),
                resultResolution = { width: 'Error-', height: '-Can-not-find-resolution' },
                satisfactoryResolutions = { distances: [], values: [] },
                allowableResolutions = { distances: [], values: [] };

            if ('undefined' !== typeof availableResolutions) {
                for (var i = 0; i < availableResolutions.length; i++) {
                    if (availableResolutions[i].width >= requiredWidth && availableResolutions[i].height >= requiredHeight) {
                        satisfactoryResolutions.distances.push(
                            getDistance(requiredWidth, requiredHeight, availableResolutions[i].width, availableResolutions[i].height)
                        );
                        satisfactoryResolutions.values.push({width: availableResolutions[i].width, height: availableResolutions[i].height});
                    }
                    else {
                        allowableResolutions.distances.push(
                            getDistance(requiredWidth, requiredHeight, availableResolutions[i].width, availableResolutions[i].height)
                        );
                        allowableResolutions.values.push({width: availableResolutions[i].width, height: availableResolutions[i].height});
                    }
                }
                if (satisfactoryResolutions.distances.length) {
                    resultResolution = satisfactoryResolutions.values[satisfactoryResolutions.distances.indexOf(Math.min.apply(null, satisfactoryResolutions.distances))];
                }
                else {
                    resultResolution = allowableResolutions.values[allowableResolutions.distances.indexOf(Math.min.apply(null, allowableResolutions.distances))];
                }
            }

            return resultResolution;
        };
        
        return helper;
    }
);