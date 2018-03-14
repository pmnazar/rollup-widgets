define(
    'strings/parse-url-params',
    function() {
        var parseUrlParams = function(str) {
            var result = {};
            str.split('&').forEach(function(x){
                var arr = x.split('=');
                arr[1] && (result[arr[0]] = arr[1]);
            });
            return result;
        };
        
        return parseUrlParams;
    }
);