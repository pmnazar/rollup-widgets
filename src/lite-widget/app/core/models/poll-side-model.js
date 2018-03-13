define(
    'js/models/poll-side-model',
    [
        'app'
    ],
    function(App) {

        var pollSideModel = App.Model.defaultModel.extend({
            defaults: {
                '@type': 'com.oneworldonline.backend.entities.SideDto',
                'id': null,
                'voted': false,
                'incomingOpinions': null,
                'incomingDataPoints': null,
                'localeId': null,
                'locale': null,
                'status': null,
                'votes': 0,
                'opinions': [],
                'dataPoints': [],
                'answer': '',
                'sideColor': 'white',
                'trueIdentityCssClassIndex': 'trId-1'
            }
        });

        return pollSideModel;
    }
);