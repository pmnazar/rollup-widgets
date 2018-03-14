const parseForm = {};

parseForm.inputToObject = function(formId) {
  var form = document.getElementById(formId),
    input = form.querySelectorAll('input'),
    formObject = {};

  function buildNestedObject(formObject, listOfObject, index) {
    var elemIndex = index;

    formObject[listOfObject[elemIndex]] = listOfObject[elemIndex + 1] ? {} : value;

    return (elemIndex + 1) < listOfObject.length ? buildNestedObject(formObject[listOfObject[elemIndex]], listOfObject, elemIndex + 1) : false;
  }

  for (var i = 0; i < input.length; i++) {
    var name = input[i].name,
      value = input[i].value;

    if (name && value) {
      if (name.split('.').length > 1) {
        var listOfObject = name.split('.');

        buildNestedObject(formObject, listOfObject, 0);
      }
      else {
        formObject[name] = value;
      }
    }
  }

  return formObject;
};

export default parseForm
