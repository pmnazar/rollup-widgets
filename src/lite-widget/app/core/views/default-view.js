import Backbone from '../libs/backbone';
import _ from 'underscore';

export default Backbone.View.extend({
  parent: {},
  initialize: function() {
    var self = this;
    if ('parent' in arguments[0]) self.parent = arguments[0].parent;
    self.onInitialize.apply(this, arguments);
  },
  onInitialize: function() {
  },
  prepareTpl: function(tpl) {
    var re = /<tpl[\s\t]+id=\"((?!\")\w+)\"[\s\t]*>(((?!<\/tpl).)*)<\/tpl>/g,
      templateCollection = {};

    tpl.replace(/(\r\n|\n|\r)/gm, '').replace(re, function (matchStr, id, template) {
      templateCollection[id] = template;
    });

    return templateCollection;
  },
  getTemplate: function(templateId, tplObject) {
    var self = this,
      functionArguments = {},
      result = '';

    if (tplObject[templateId]) {
      if (3 == arguments.length && 'object' == typeof argumentsToArray(arguments)[2]) {
        functionArguments = argumentsToArray(arguments)[2];
      }
      result = _.template(tplObject[templateId]);
    }

    function argumentsToArray(args) {
      return Array.prototype.slice.call(args);
    }

    return result(functionArguments);
  },
  showLoader: function () {
    $('#loaderDiv').show();
  },
  hideLoader: function () {
    $('#loaderDiv').hide();
  },
  onPageLoaded: function() {
    /* Abstract method */
  }
});