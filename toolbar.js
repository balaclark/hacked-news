
(function (window) {

  'use strict';

  var req = window.location.search.match(/^\?src=(.+)?&title=(.+)&no_comments=(.+)&comments_url=(.+)&viewmode=(.+)$/),
    srcHtml,
    src = decodeURIComponent(req[1]),
    title = decodeURIComponent(req[2]),
    no_comments = req[3],
    comments_url = decodeURIComponent(req[4]),
    viewmode = decodeURIComponent(req[5]),
    toolbar = document.querySelector('#toolbar'),
    upvote = document.querySelector('#upvote'),
    iframe = document.querySelector('#content'),
    readable = document.querySelector('#readable'),
    view_text = document.querySelector('#viewtext'),
    view_original = document.querySelector('#original');

  view_original.href = src;
  iframe.src = src;

  if (viewmode === 'original') iframe.style.display = 'block';
  else if (viewmode === 'viewtext') readable.style.display = 'block';

  document.title = title;
  document.querySelector('#title').innerText = title;
  document.querySelector('#close').href = src;
  document.querySelector('#no_comments').innerText = no_comments;
  document.querySelector('#comments').href = comments_url;
  document.querySelector('#' + viewmode).style.display = 'none';

  function ajax(method, url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        callback(xhr.responseText, xhr);
      }
    };
    xhr.send();
  }

  /**
   * Tries to keep the iframe height always at 100%.
   */
  function fitContent() {
    var height = window.innerHeight - toolbar.offsetHeight;
    iframe.style.height = readable.style.height = height + 'px';
  }

  fitContent();

  window.addEventListener('resize', fitContent, false);

  ajax('GET', src, function (html, xhr) {

    // break out of the iframe if the site doesn't allow embedding
    // TODO: detect JS frame breakers as well
    if (xhr.getResponseHeader('x-frame-options')) {
      chrome.extension.sendMessage({
        method: 'openBackgroundPage',
        url: comments_url
      });
      window.location = src;
    }

    // setup the text only view
    var processed = readability.init({ html: html });
    readable.innerHTML = '<div id="readInner">' + processed.innerHTML + '</div>';
  });

  function setPoints(html) {
    document.querySelector('#points').innerText = html.match(/<span id=score_.+?>(\d+ point(?:s)?)/)[1];
  }

  // get extra info via ajax
  ajax('GET', comments_url, function (html) {
    var upvote_el = html.match(/<table border=0><tr><td><center><a id=up_.+?href="(.+?)"/);
    setPoints(html);
    document.querySelector('#site').innerText = html.match(/<span class="comhead"> (.+) <\/span>/)[1];
    if (upvote_el) {
      upvote.href = 'https://news.ycombinator.com/' + upvote_el[1].replace(/&amp;/g, '&');
      upvote.style.display = 'inline';
    }
  });

  // update comment count on tab focus
  window.addEventListener('focus', function () {
    ajax('GET', comments_url, function (html) {
      try {
        setPoints(html);
        document.querySelector('#no_comments').innerText = html.match(/([0-9]+) comments/)[1];
      } catch (e) {}
    });
  }, false);

  // upvote via ajax
  upvote.addEventListener('click', function (e) {
    e.preventDefault();
    ajax('GET', upvote.href, function (response) {
      upvote.style.display = 'none';
    });
  }, false);

  // show text only version
  view_text.addEventListener('click', function (e) {
    e.preventDefault();
    iframe.style.display = 'none';
    readable.style.display = 'block';
    view_text.style.display = 'none';
    view_original.style.display = 'inline';
  }, false);

  // show original version
  view_original.addEventListener('click', function (e) {
    e.preventDefault();
    readable.style.display = 'none';
    iframe.style.display = 'block';
    view_original.style.display = 'none';
    view_text.style.display = 'inline';
  }, false);

}(window));
