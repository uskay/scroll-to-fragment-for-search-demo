const google = _ => {
  injectScrollToText('.g em', 'g');
}

const yj = _ => {
  injectScrollToText('.sw-Card__summary b', 'sw-CardBase');
}

const injectScrollToText = (boldTextSelector, parentIdentifiableClassName ) => {
  [...document.querySelectorAll(boldTextSelector)].forEach(boldText => {
    let currentElm = boldText;
    while (true) {
      currentElm = currentElm.parentNode;
      if(currentElm.classList.contains(parentIdentifiableClassName)){
        break;
      }
    }
    const baseURL = currentElm.querySelector('a').href;
    const link = document.createElement('a');
    const prefixAndSuffix = getPrefixAndSuffix(boldText);
    const text = [];
    if (prefixAndSuffix[0]) {
      text.push(`${prefixAndSuffix[0]}-`);
    }
    text.push(boldText.innerText);
    if (prefixAndSuffix[1]) {
      text.push(`-${prefixAndSuffix[1]}`);
    }
    link.href = `${baseURL}#:~:text=${text.join(',')}`;
    link.innerText = boldText.innerText;
    link.rel = 'noopener';
    boldText.textContent = '';
    boldText.style.backgroundColor = 'yellow';
    boldText.style.textDecoration = 'underline';
    boldText.appendChild(link);
  });
}

const getPrefixAndSuffix = (boldText) => {
  const res = ['', ''];
  const temporaryDelimiterString = '@TEMP_PLACEHOLDER@';
  const wholeSnippet = boldText.parentNode;
  const temporaryDelimiter = document.createTextNode(temporaryDelimiterString);
  wholeSnippet.replaceChild(temporaryDelimiter, boldText);
  const prefixAndSuffix = wholeSnippet.innerText.split(temporaryDelimiterString);
  if (prefixAndSuffix[0]) {
    const prefixCandidte = prefixAndSuffix[0].trim().split(' ');
    res[0] = prefixCandidte[prefixCandidte.length - 1];
  }
  if (prefixAndSuffix.length > 1 && prefixAndSuffix[1]){
    const suffixCandidte = prefixAndSuffix[1].trim().split(' ');
    res[1] = suffixCandidte[0].split('...')[0].trim();
  }
  wholeSnippet.replaceChild(boldText, temporaryDelimiter);
  return res;
}

switch (location.origin) {
  case 'https://www.google.co.jp':
    google();
    break;
  case 'https://search.yahoo.co.jp':
    yj();
    break;
  default:
    break;
}