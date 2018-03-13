import _ from 'underscore';

var mergeWidgetSettingsWithDefaults = function(widgetSettings, defaultSetting, excludedFields) {
  var widgetType = widgetSettings.type,
    isExcludedFields = 'undefined' !== typeof excludedFields && _.isArray(excludedFields),
    displayLocale = widgetSettings.displayLocale,
    settingField,
    field;

  for (field in defaultSetting) {
    settingField = defaultSetting[field];

    if (('undefined' === typeof widgetSettings[field] || null === widgetSettings[field])
      && 'undefined' !== typeof settingField
      && (!isExcludedFields || -1 === excludedFields.indexOf(field))
    ) {
      if (_.isObject(settingField) && (!_.isUndefined(settingField[displayLocale]) || !_.isUndefined(settingField['default']))) {
        widgetSettings[field] = _.isUndefined(settingField[displayLocale]) ? settingField['default'] : settingField[displayLocale];
      }
      else {
        widgetSettings[field] = settingField;
      }
    }
  }
};

export default mergeWidgetSettingsWithDefaults