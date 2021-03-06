
(function (chrome) {

  'use strict';

  var input = {
    new_window_articles: document.querySelector('#new-window-articles'),
    open_in_background: document.querySelector('#open-in-background'),
    use_toolbar: document.querySelector('#use-toolbar'),
    viewtext: document.querySelector('#viewtext')
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
  }

  document.addEventListener('DOMContentLoaded', restore_options)

  input.new_window_articles.addEventListener('change', save_options);
  input.open_in_background.addEventListener('change', save_options);
  input.use_toolbar.addEventListener('change', save_options);
  input.viewtext.addEventListener('change', save_options);

}(chrome));
