const dicPath = chrome.runtime.getURL("/dict/");
const kuromojiBuilder = kuromoji.builder({ dicPath: dicPath });
let myTokenizer = null;
kuromojiBuilder.build((err, tokenizer) => {
  myTokenizer = tokenizer;
  window.addEventListener("injectScrollToText", data => {
    // paramenters
    const boldText = data.detail.boldText;
    const baseURL = data.detail.baseURL;

    // Retreving the prefix and suffix candidate
    const temporaryDelimiterString = '@TEMP_PLACEHOLDER@';
    const wholeSnippet = boldText.parentNode;
    const temporaryDelimiter = document.createTextNode(temporaryDelimiterString);
    wholeSnippet.replaceChild(temporaryDelimiter, boldText);
    const prefixAndSuffix = wholeSnippet.innerText.split(temporaryDelimiterString);

    // Choosing the actual prefix and suffix
    const finalPrefixAndSuffix = ['', ''];
    if (prefixAndSuffix[0].trim()) {
      const tokenedPrefix = myTokenizer.tokenize(prefixAndSuffix[0].trim()).slice(-3);
      let prefix = '';
      tokenedPrefix.forEach(token => {
        prefix = prefix + token.surface_form;
      });
      finalPrefixAndSuffix[0] = prefix;
    }
    if (prefixAndSuffix[1].trim()) {
      const tokenedSuffix = myTokenizer.tokenize(prefixAndSuffix[1].trim()).slice(0, 3);
      let suffix = '';
      tokenedSuffix.forEach(token => {
        if (token.surface_form !== '...') {
          suffix = suffix + token.surface_form;
        }
      });
      finalPrefixAndSuffix[1] = suffix;
    }

    // clean up
    wholeSnippet.replaceChild(boldText, temporaryDelimiter);

    // inject ScrollToText
    const text = [];
    if (finalPrefixAndSuffix[0]) {
      text.push(`${finalPrefixAndSuffix[0]}-`);
    }
    text.push(boldText.innerText);
    if (finalPrefixAndSuffix[1]) {
      text.push(`-${finalPrefixAndSuffix[1]}`);
    }
    const link = document.createElement('a');
    link.href = `${baseURL}#:~:text=${text.join(',')}`;
    link.innerText = boldText.innerText;
    link.rel = 'noopener';
    boldText.textContent = '';
    boldText.style.backgroundColor = 'yellow';
    boldText.style.textDecoration = 'underline';
    boldText.appendChild(link);
  }, false);  
})

