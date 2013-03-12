/*jslint plusplus: true, browser: true, indent: 2 */

(function (chrome, document) {

  'use strict';

  var i, author_links,
    article_links = document.querySelectorAll('.title a, a.content-story-title'),
    author = document.querySelector('.subtext a'),
    spacer_gifs = document.querySelectorAll('img[src="s.gif"]');

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

    document.addEventListener('click', function (e) {

      var comment_link, parent, el = e.srcElement;

      if (el.tagName === 'A' && el.innerText !== 'More' &&
         (el.className === 'content-story-title' || el.parentElement.className === 'title')) {

        e.preventDefault();

        comment_link = (window.location.host !== 'www.hnsearch.com')
          ? el.parentNode.parentNode.nextElementSibling.querySelector('.subtext a[href^=item]')
          : el.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('.content-result-subheader a:nth-child(2)');

        chrome.extension.sendMessage({
          method: 'openArticle',
          url: el.href,
          title: el.innerText,
          no_comments: comment_link.innerText.match(/^[0-9]+/),
          comments_url: comment_link.href
        });
      }
    });
  });

  function resetTabIndex() {
    chrome.extension.sendMessage({ method: 'resetTabIndex' });
  }

  if (window.location.pathname !== '/item') {
    window.addEventListener('load', resetTabIndex, false);
    window.addEventListener('beforeunload', resetTabIndex, false);
  }

}(chrome, document, window));
