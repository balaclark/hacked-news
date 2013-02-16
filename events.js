
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.method === 'getOptions') {
    chrome.storage.sync.get(function (options) {
      sendResponse(options)
    });
  }

  return true;
});