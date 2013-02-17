
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

  'use strict';

  chrome.storage.sync.get(function (options) {

    switch (request.method) {

      case 'getOptions':
        sendResponse(options);
        break;

      case 'openTab':

        chrome.tabs.getSelected(null, function (current_tab) {

          chrome.storage.local.get(function (storage) {

            var last_tab_index = storage.last_tab_index;

            if (!last_tab_index) {
              last_tab_index = current_tab.index;
            }

            last_tab_index++;

            chrome.storage.local.set({
              last_tab_index: last_tab_index
            });

            chrome.tabs.create({
              url: request.url,
              active: !options.open_in_background,
              index: last_tab_index
            });
          });
        });
        break;
    }

  });

  return true;
});
