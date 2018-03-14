define('settings/widget-types',
    [
        'config'
    ],
    function(config) {
        var widgetTypes = require('widget-types/' + config.environment.type);
        
        return widgetTypes;
    }
);