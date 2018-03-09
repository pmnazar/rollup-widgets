import Backbone from 'backbone';
import _ from 'underscore';
import tpl from './tpl.html';

const app = {};

app.View = Backbone.View.extend({
  el: '#main',
  prepareTpl: function (tpl) {
    const re = /<tpl[\s\t]+id=\"((?!\")\w+)\"[\s\t]*>(((?!<\/tpl).)*)<\/tpl>/g;
    const templateCollection = {};

    tpl.replace(/(\r\n|\n|\r)/gm, '').replace(re, function (matchStr, id, template) {
      templateCollection[id] = template;
    });

    return templateCollection;
  },
  getTemplate: function (templateId, tplObject) {
    let functionArguments = {};
    let result = '';

    if (tplObject[templateId]) {
      if (3 === arguments.length && 'object' === typeof argumentsToArray(arguments)[2]) {
        functionArguments = argumentsToArray(arguments)[2];
      }
      result = _.template(tplObject[templateId]);
    }

    function argumentsToArray(args) {
      return Array.prototype.slice.call(args);
    }

    return result(functionArguments);
  },
  onInitialize: function () {
    this.templatesObject = this.prepareTpl(tpl);
  },
  render() {
    this.onInitialize();
    const a = 25;
    this.$el.html(this.getTemplate('tplTest', this.templatesObject, {
      a
    }));
  }
});

new app.View().render();