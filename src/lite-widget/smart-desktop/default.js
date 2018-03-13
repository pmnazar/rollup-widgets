import App from '../app/core/';

export default App.View.defaultView.extend({
  $el: '#body',
  render() {
     $el.html('test');
  }
})