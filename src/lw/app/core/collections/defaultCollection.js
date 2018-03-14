import Backbone from "../libs/backbone";
import defaultModel from '../models/defaultModel';

export default Backbone.Collection.extend({
  model: defaultModel,
  currentElementIndex: 0,
  initialize: function() {
    var self = this;

    self.on('collectionIsSet', self.onCollectionSet);
    self.onInitialize();
  },
  onInitialize: function() {
    /* abstract method */
  },
  onCollectionSet: function() {
    /* abstract method */
  },
  set: function() {
    var self = this,
      thisFromNativeSet;

    thisFromNativeSet = Backbone.Collection.prototype.set.apply(self, Array.prototype.slice.call(arguments));

    if ( !arguments[1] ) {
      self.trigger('collectionIsSet');
    } else {
      if ( typeof arguments[1] === 'object' && typeof arguments[1] !== 'array' && !arguments[1].silent) {
        self.trigger('collectionIsSet');
      }
    }

    return thisFromNativeSet;
  },
  getCurrentElement: function() {
    var self = this;

    return this.at(self.currentElementIndex);
  },
  getPrevElementIndex: function() {
    var self = this;
    var index = self.currentElementIndex;
    if (index > 0) {
      index--;
    }
    else {
      index = self.length - 1;
    }
    return index;
  },
  getNextElementIndex: function() {
    var self = this;
    var index = self.currentElementIndex;
    if (index + 1 < self.length) {
      index++;
    }
    else {
      index = 0;
    }
    return index;
  },
  next: function () {
    var self = this;
    self.currentElementIndex = self.getNextElementIndex();
    return self.at(self.currentElementIndex);
  },
  prev: function() {
    var self = this;
    self.currentElementIndex = self.getPrevElementIndex();
    return self.at(self.currentElementIndex);
  },
  fill: function(data) {
    var self = this;
    var modelInfo = self.model.info;
    _.each(data, function(element) {
      self.add(App.create(modelInfo.type, modelInfo.name, modelInfo.scope, element));
    });
    return self;
  },
  kill: function() {
    this.reset();

    return true;
  },
  findByAttribute: function(filterObject) {
    return this.find(function(model) {
      var result = true;
      for (var key in filterObject) {
        if (model.get(key) != filterObject[key]) {
          result = false;
          break;
        }
      }
      return result;
    });
  }
});