
(function () {

  'use strict';

  var input = {
    new_window_articles: document.querySelector('#new-window-articles'),
    new_window_comments: document.querySelector('#new-window-comments')
  }

  function save_options() {

    var value = {},
        status = document.querySelector('#status');

    value[this.name] = this.checked;

    chrome.storage.sync.set(value, function () {
      status.innerHTML = 'Options saved.';
      setTimeout(function() {
        status.innerHTML = '';
      }, 750);
    });
  }

  function restore_options() {

    chrome.storage.sync.get(function (options) {
      for (var key in options) {
        input[key].checked = options[key];
      }
    });

    // new_window_articles.checked = !!parseInt(chrome.storage.local.get('h48ed_news_new_window_articles'));
    // new_window_comments.checked = !!parseInt(chrome.storage.local.get('h48ed_news_new_window_comments'));
  }

  document.addEventListener('DOMContentLoaded', restore_options)

  input.new_window_articles.addEventListener('change', save_options);
  input.new_window_comments.addEventListener('change', save_options);

}());
