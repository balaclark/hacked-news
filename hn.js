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

    // manually set spacer row widths
    for (i = 0; i < spacer_gifs.length; ++i) {
      spacer_gifs[i].parentElement.width = spacer_gifs[i].width;
    }
  }

  chrome.extension.sendMessage({ method: 'getOptions' }, function (options) {

    var i, link;

    function openLinkInNewWindow(e) {
      e.stopPropagation();
      e.preventDefault();
      chrome.extension.sendMessage({ method: 'openTab', url: this.href });
    }

    // open article in new windows
    if (options.new_window_articles) {
      for (i in article_links) {
        link = article_links[i];
        if (typeof link === 'object' && link.innerText !== 'More') {
          link.addEventListener('click', openLinkInNewWindow, false);
        }
      }
    }

    // open comment links in new windows
    if (options.new_window_comments) {
      for (i in comment_links) {
        link = comment_links[i];
        if (typeof link === 'object' && link.innerText !== 'More') {
          link.addEventListener('click', openLinkInNewWindow, false);
        }
      }
    }
  });

}(chrome, document, window));
