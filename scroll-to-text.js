injectScrollToText = (boldTextSelector, parentIdentifiableClassName ) => {
  [...document.querySelectorAll(boldTextSelector)].forEach(boldText => {
    let currentElm = boldText;
    while (true) {
      currentElm = currentElm.parentNode;
      if(currentElm.classList.contains(parentIdentifiableClassName)){
        break;
      }
    }
    const baseURL = currentElm.querySelector('a').href;
    window.dispatchEvent(
      new CustomEvent("injectScrollToText", {
        detail: {
          boldText: boldText,
          baseURL: baseURL
        }
      }
    ));
  });
}

switch (location.origin) {
  case 'https://www.google.co.jp':
    injectScrollToText('.g em', 'g');
    break;
  case 'https://search.yahoo.co.jp':
    injectScrollToText('.sw-Card__summary b', 'sw-CardBase');
    break;
  default:
    break;
}

