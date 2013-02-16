
(function (chrome, document) {

  'use strict';

  var i, link, options = {},
      article_links = document.querySelectorAll('.title a'),
      comment_links = document.querySelectorAll('.subtext a[href^=item]'),
      author_links = document.querySelectorAll(
        'a[href="user?id=' + document.querySelector('.subtext a').innerText + '"]'
      ),
      spacer_gifs = document.querySelectorAll('img[src="http://ycombinator.com/images/s.gif"]');

  chrome.storage.sync.get(function (opts) {
    options = opts;
  });

  console.log(options)

  // tag the OP
  if (document.querySelectorAll('.title').length === 1) {
    for (i = 0; i < author_links.length; ++i) {
      author_links[i].className += ' op';
    }
  }

  // manually set spacer row widths
  for (i = 0; i < spacer_gifs.length; ++i) {
    spacer_gifs[i].parentElement.width = spacer_gifs[i].width;
  }

  // open article in new windows
  // if (options.h48ed_news_new_window_articles) {
    for (i in article_links) {
      link = article_links[i]
      if (typeof link === 'object' && link.innerText !== 'More') {
        link.addEventListener('click', openLinkInNewWindow, false);
      }
    }
  // }

  // open comment links in new windows
  // if (options.h48ed_news_new_window_comments) {
    for (i in comment_links) {
      link = comment_links[i]
      if (typeof link === 'object' && link.innerText !== 'More') {
        link.addEventListener('click', openLinkInNewWindow, false);
      }
    }
  // }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function openLinkInNewWindow(e) {
    e.stopPropagation();
    e.preventDefault();
    window.open(this.href);
  }

}(chrome, document));
