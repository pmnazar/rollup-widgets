define(
    'maps/d3-libs-loader',
    function() {
        return function(array) {
            var deferred = new $.Deferred(),
                protocol = document.location.protocol === 'https:'? 'https' : 'http';

            function loadScript(src, handler) {
                var script = document.createElement('script'),
                    head = document.getElementsByTagName('head')[0];

                if ( src.indexOf('http') !== 0 ) {
                    src = protocol + '://' + src;
                }

                script.src = src;
                script.onload = script.onreadystatechange = function() {
                script.onreadystatechange = script.onload = null;
                    handler();
                };
                (head || document.body).appendChild( script );
            }

            function load(){

                if ( array.length !== 0 ) {
                    loadScript(array.shift(), load);
                }
                else {
                    deferred.resolve();
                }
            }

            if ( typeof d3 === 'undefined' ) {
                load();
            }
            else {
                deferred.resolve();
            }

            return deferred;
        };
    }
);