import App from '../';

export default App.Model.defaultModel.extend({
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
});;