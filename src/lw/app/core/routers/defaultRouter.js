import Backbone from "../libs/backbone";

export default Backbone.Router.extend({
  initialize: function () {
    Backbone.history.start();
  }
});