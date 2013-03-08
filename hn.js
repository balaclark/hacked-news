/*jslint plusplus: true, browser: true, indent: 2 */

(function (chrome, document) {

  'use strict';

  var i, author_links,
    article_links = document.querySelectorAll('.title a'),
    comment_links = document.querySelectorAll('.subtext a[href^=item]'),
    author = document.querySelector('.subtext a'),
    spacer_gifs = document.querySelectorAll('img[src="http://ycombinator.com/images/s.gif"]');

  if (author) {

    // tag the OP
    author_links = document.querySelectorAll(
      'a[href="user?id=' + author.innerText + '"]'
    );

    if (document.querySelectorAll('.title').length === 1) {
      for (i = 0; i < author_links.length; ++i) {
        author_links[i].className += ' op';
      }
    }

    // manually set spacer row widths so that the theme plays nicely with Hacker News Collapse
    for (i = 0; i < spacer_gifs.length; ++i) {
      spacer_gifs[i].parentElement.width = spacer_gifs[i].width;
    }
  }

  chrome.extension.sendMessage({ method: 'getOptions' }, function (options) {

    var i, link;

    function openArticleInNewWindow(e) {

      var comment_link = this.parentNode.parentNode.nextElementSibling.querySelector('.subtext a[href^=item]');

      e.stopPropagation();
      e.preventDefault();

      chrome.extension.sendMessage({
        method: 'openTab',
        url: this.href,
        title: this.innerText,
        no_comments: comment_link.innerText.match(/^[0-9]+/),
        comments_url: comment_link.href
      });
    }

    // TODO: move this code to events.js so that window refreshes aren't needed
    // after updating the options
    if (options.new_window_articles) {
      for (i in article_links) {
        link = article_links[i];
        if (typeof link === 'object' && link.innerText !== 'More') {
          link.addEventListener('click', openArticleInNewWindow, false);
        }
      }
    }
  });

  function resetTabIndex() {
    chrome.extension.sendMessage({ method: 'resetTabIndex' });
  }

  if (window.location.pathname !== '/item') {
    window.addEventListener('load', resetTabIndex, false);
    window.addEventListener('beforeunload', resetTabIndex, false);
  }

}(chrome, document, window));
