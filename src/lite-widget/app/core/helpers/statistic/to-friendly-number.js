define(
    'statistic/to-friendly-number',
    function() {
        var toFriendlyNumber = function(number, decimPlaces) {
            var MIN_WITHOUT_DECIMAL = 100;
            // 2 decimal places => 100, 3 => 1000, etc
            var decPlaces = Math.pow(10, decimPlaces);
            // Enumerate number abbreviations
            var abbrev = [ "K", "M", "B", "T" ];
            // Go through the array backwards, so we do the largest first
            for (var i=abbrev.length-1; i>=0; i--) {
                // Convert array index to "1000", "1000000", etc
                var size = Math.pow(10,(i+1)*3);
                // If the number is bigger or equal do the abbreviation

                var intervalWithoutDecimal = {
                    min: 9999,
                    max: 1000000
                };

                if (size <= number) {
                    // Here, we multiply by decPlaces, round, and then divide by decPlaces.
                    // This gives us nice rounding to a particular decimal place.
                    //number = Math.round(number*decPlaces/size)/decPlaces;

                    if (number > intervalWithoutDecimal.min && number < intervalWithoutDecimal.max) {
                        number = (Math.round(number*decPlaces/size)/decPlaces).toFixed(0);
                    }
                    else {
                        number = Math.round(number*decPlaces/size)/decPlaces;
                    }

                    if (number > MIN_WITHOUT_DECIMAL) {
                        number = Math.round(number);
                    }
                    // Handle special case where we round up to the next abbreviation
                    if((number == 1000) && (i < abbrev.length - 1)) {
                        number = 1;
                        i++;
                    }
                    // Add the letter for the abbreviation
                    number += abbrev[i];
                    // We are done... stop
                    break;
                }
            }

            return number;
        };

        return toFriendlyNumber;
    }
);