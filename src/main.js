import jquery from './lite-widget/app/core/libs/zepto';
import Backbone from 'backbone';
Backbone.$ = jquery;
console.log(Backbone);
const App = {
  View: Backbone.View.extend({
    el: '#body',
    render() {
      this.$el.html('html')
    }
  })
};

new App.View().render();