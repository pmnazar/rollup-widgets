import App from '../';

export default App.Model.defaultModel.extend({
  defaults: {
    "id": 0,
    "localeId": null,
    "locale": "en",
    "question": "",
    "yesAnswer": "",
    "noAnswer": "",
    "tagline": "",
    "icon": "",
    "totalYes": null,
    "totalNo": null,
    "featured": null,
    "watched": null,
    "voted": null,
    "vote": "",
    "imagesLoaded": null,
    "created": null,
    "opinions": null,
    "yesOpinion": null,
    "noOpinion": null,
    "taglineOrQuestion": "",
    "poll": null,
    "code": "",
    "adminObject": null,
    "category": null,
    "admin": null,
    "categoryObject": null,
    "published": null,
    "totalVotes": 0
  }
});