import Backbone from "../libs/backbone";

export default Backbone.Model.extend({
  initialize: function(model) {
    var self = this;

    if ('onInitialize' in self) {
      self.onInitialize();
    }
  },
  kill: function() {
    this.off(null, null, this);
    this.clear({'silent': true});
    return true;
  },
  getSerialNumberInCollection: function() {
    var self = this,
      result = -1;

    if (self.collection && self.collection.length) {
      result = self.collection.indexOf(self);
    }

    return result;
  }
});