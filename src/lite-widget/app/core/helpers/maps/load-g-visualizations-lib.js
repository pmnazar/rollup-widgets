define(
    'maps/load-g-visualizations-lib',
    function() {
        var loadGCharts = function() {
            var protocol = document.location.protocol === 'https:'? 'https' : 'http',
                src = protocol + '://www.gstatic.com/charts/loader.js',
                deferred = new $.Deferred();

            function loadGMainScript() {
                google.charts.load('current', { packages: ['corechart'] });
                google.charts.setOnLoadCallback(onLoadSuccess);
            }

            function injectScript(src, callback) {
                var script,tag;

                script = document.createElement('script');
                script.type = 'text/javascript';
                script.async = true;
                script.src = src;
                script.onload = callback;
                tag = document.getElementsByTagName('script')[0];
                tag.parentNode.insertBefore(script, tag);
            }

            function onLoadSuccess() {
                deferred.resolve(google);
                console.log('google visualizations lib loaded');
            }

            injectScript(src, loadGMainScript);

            return deferred;
        };

        return loadGCharts;
    }
);