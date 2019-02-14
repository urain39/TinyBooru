/*
 * Copyright 2018 urain39
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
  var DATA_URL = "https://yande.re/post/index.json?tags={tags}&limit={limit}&page={page}";

  function $(selector) {
    return document.querySelectorAll(selector);
  }

  function renderPage(ijkmgr, params) {
    var currPage = params.page;

    new SyncQueue()
    .add(function (context) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", DATA_URL.format(params), true);
      xhr.responseType = "json";
      xhr.setRequestHeader("Content-Type", "text/plain");
      xhr.onload = function() {
        context.setResult(this.response);
        context.finish();
      };
      xhr.send(null);
    })
    .then(function (context) {
      if (currPage !== params.page) {
        // Holy sh*t! we are too late!
        alert("skip render page {0}.".format([currPage]));
        return;
      }

      ijkmgr.render({
        posts: context.getResult(),
        params: params
      });

      // (Re-)Binding events
      $("#btn-search")[0].onclick = function(event) {
        if (params.page != 0) {
          params.tags = $("#search-box")[0].value;
        }
        params.page = 1; // Reset.
        renderPage(ijkmgr, params);
      };
      if (params.page < 1) {
        return; // skip page 0.
      }
      $("#btn-prev-page")[0].onclick = function(event) {
        params.page = (--params.page > 0 ? params.page : 0);
        renderPage(ijkmgr, params);
      };
      $("#btn-next-page")[0].onclick = function(event) {
        params.page = (++params.page > 1e9 ? 1 : params.page);
        renderPage(ijkmgr, params);
      };
      // Mark render complete.
      context.complete();
    })
    .start();
  }

  window.onload = function() {
    var self = this;
    var $vConsolse = new VConsole();
    var tpl = $("#viewport")[0];

    self.ijkmgr = new IJKTPL(tpl, {
      posts: [],
      params: { page: 0 }
    }, { debug: true });
    self.ijkmgr.compile();
    // Splash page.
    $("#viewport")[0].classList.remove("ijktpl-tpl");

    var params = {
      tags: "order:date+rating:s",
      limit: 30,
      page: 1
    };
    renderPage(ijkmgr, params);
  };
})();

// vim: set ts=2 sw=2 ff=unix et:
