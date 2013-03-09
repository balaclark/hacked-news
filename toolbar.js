
(function (window) {

  'use strict';

  var req = window.location.search.match(/^\?src=(.+)?&title=(.+)&no_comments=(.+)&comments_url=(.+)&viewmode=(.+)$/),
    src = decodeURIComponent(req[1]),
    title = decodeURIComponent(req[2]),
    no_comments = req[3],
    comments_url = decodeURIComponent(req[4]),
    viewmode = decodeURIComponent(req[5]),
    toolbar = document.querySelector('#toolbar'),
    upvote = document.querySelector('#upvote'),
    iframe = document.querySelector('#content'),
    view_text = document.querySelector('#viewtext'),
    view_original = document.querySelector('#original');

  view_original.href = src;
  view_text.href = 'http://viewtext.org/api/text?url=' + encodeURIComponent(src);
  iframe.src = (viewmode === 'original') ? src : view_text.href;
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
    }
    xhr.send();
  }

  function fitIframe() {
    iframe.style.height = (document.height - toolbar.clientHeight) + 'px';
  };

  fitIframe();

  window.addEventListener('resize', fitIframe, false);

  // break out of the iframe if the site doesn't allow embedding
  ajax('GET', src, function (html, xhr) {
    if (xhr.getResponseHeader('x-frame-options')) {
      window.location = src;
    }
  });

  // get extra info via ajax
  ajax('GET', comments_url, function (html) {
    var upvote_el = html.match(/<table border=0><tr><td><center><a id=up.+?href="(.+?)"/);
    document.querySelector('#site').innerText = html.match(/<span class="comhead"> (.+) <\/span>/)[1];
    if (upvote_el) {
      upvote.href = 'http://news.ycombinator.com/' + upvote_el[1];
      upvote.style.display = 'inline';
    }
  });

  // update comment count on tab focus
  window.addEventListener('focus', function () {
    ajax('GET', comments_url, function (html) {
      try {
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
    iframe.src = view_text.href;
    view_text.style.display = 'none';
    view_original.style.display = 'inline';
  }, false);

  // show original version
  view_original.addEventListener('click', function (e) {
    e.preventDefault();
    iframe.src = view_original.href;
    view_original.style.display = 'none';
    view_text.style.display = 'inline';
  }, false);

}(window));
