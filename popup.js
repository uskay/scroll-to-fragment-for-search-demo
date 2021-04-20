[...document.querySelectorAll('.feature-toggle button')].forEach(btn => {
  btn.addEventListener("click", async (evt) => {

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['kuromoji.js']
    });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: [`${evt.target.id}.js`]
    });
  })
});
