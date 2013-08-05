
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

  'use strict';

  chrome.storage.sync.get(function (options) {

    switch (request.method) {

      case 'getOptions':
        sendResponse(options);
        break;

      case 'openArticle':

        chrome.tabs.getSelected(null, function (current_tab) {

          chrome.storage.local.get(function (storage) {

            var last_tab_index = storage.last_tab_index,

            yc_url = request.url.search(/^http(s)?:\/\/news.ycombinator/) > -1,

            toolbar_url = 'toolbar.html?src=' +
              encodeURIComponent(request.url) +
              '&title=' + encodeURIComponent(request.title) +
              '&no_comments=' + (request.no_comments || 0) +
              '&comments_url=' + encodeURIComponent(request.comments_url) +
              '&viewmode=' + ((options.viewtext === true) ? 'viewtext' : 'original'),

            url = (options.use_toolbar && !yc_url)
              ? toolbar_url : request.url;

            if (options.new_window_articles) {

              if (!last_tab_index) {
                last_tab_index = current_tab.index;
              }

              last_tab_index++;

              chrome.storage.local.set({
                last_tab_index: last_tab_index
              });

              // FIXME: in incognito mode this opens the tab in the wrong window
              chrome.tabs.create({
                url: url,
                active: !options.open_in_background,
                index: last_tab_index
              });

            } else {
              chrome.tabs.update(current_tab.id, { url: url });
            }
          });
        });

        break;

      case 'openBackgroundPage':

        chrome.storage.local.get(function (storage) {

          var last_tab_index = storage.last_tab_index;

          last_tab_index++;

          chrome.storage.local.set({
            last_tab_index: last_tab_index
          });

          chrome.tabs.create({
            url: request.url,
            active: false,
            index: last_tab_index
          });
        });

        break;

      case 'resetTabIndex':
        chrome.storage.local.remove('last_tab_index');
        break;
    }

  });

  return true;
});
