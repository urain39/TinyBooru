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

  // Polyfill for Android5.x
  if (typeof NodeList.prototype.forEach !== "function") {
    NodeList.prototype.forEach = function(callback, thisArg) {
      var i, self = this;
      for (i = 0; i < self.length; i++) {
        callback.apply(thisArg, [self[i], i, self]);
      }
    };
  }

  function $(selector) {
    return document.querySelectorAll(selector);
  }

  function format(str, map) {
    return str.replace(/\{([0-9A-Za-z]+)\}/g, function(key) {
      key = key.substring(1, key.length - 1);
      return map[key] || "";
    });
  }

  function fetchPosts(params, onReady) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", format(DATA_URL, params), true);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.onload = function() {
      onReady(JSON.parse(this.responseText));
    };
    xhr.send(null);
  }

  function renderPage(ijkmgr, params) {
    fetchPosts(params, function(data) {
      ijkmgr.render({
        posts: data,
        params: params
      });

      // Apply images size.
      $("img").forEach(function(img, idx) {
        // Order same as rendered
        img.width = data[idx].preview_width;
        img.height = data[idx].preview_height;
      });

      // Re-Binding events
      $("#btn-search")[0].onclick = function() {
        if (params.page != 0) {
          params.tags = $("#search-box")[0].value;
        }
        params.page = 1; // Reset.
        renderPage(ijkmgr, params);
      };
      if (params.page < 1) {
        return; // skip page 0.
      }
      $("#btn-prev-page")[0].onclick = function() {
        params.page = (--params.page > 0 ? params.page : 0);
        renderPage(ijkmgr, params);
      };
      $("#btn-next-page")[0].onclick = function() {
        params.page = (++params.page > 1e9 ? 1 : params.page);
        renderPage(ijkmgr, params);
      };
    });  
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
    // First page.
    $("#viewport")[0].classList.remove("ijktpl-tpl");

    var params = {
      tags: "nekopara+rating:s",
      limit: 30,
      page: 1
    };
    renderPage(ijkmgr, params);
  };
})();

// vim: set ts=2 sw=2 ff=unix et:
