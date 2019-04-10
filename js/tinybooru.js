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

/*
 * jQuery is Best!!!
 */

(function() {
  var DATA_URL = "https://yande.re/post/index.json?tags={tags}&limit={limit}&page={page}";

  function saveConfig(params) {
    return localStorage.setItem(
      "config",
      JSON.stringify(params)
    );
  }

  function loadConfig(params) {
    return JSON.parse(
      localStorage.getItem("config")
    );
  }

  function fetchPosts(params) {
    return new Promise(function (resolve) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", DATA_URL.format(params), true);
      xhr.responseType = "json";
      xhr.setRequestHeader("Content-Type", "text/plain");
      xhr.onload = function() {
        var self = this;
        if (self.status === 200) {
          resolve(self.response);
        }
      };
      xhr.send(null);
    });
  }

  function renderPage(ijkmgr, params) {
    var currPage = params.page;

    fetchPosts(params)
    .then(function (data) {
      if (currPage !== params.page) {
        alert("skip render page {0}.".format([currPage]));
        return;
      }

      ijkmgr.render({
        posts: data,
        params: params
      });

      // (Re-)Binding event callbacks.
      $("#btn-search").on("click", function(event) {
        if (params.page != 0) {
          params.tags = $("#search-box").val();
        }
        params.page = 1; // Reset.
        renderPage(ijkmgr, params);
      });

      if (params.page < 1) {
        return; // skip page 0.
      }

      saveConfig(params);

      $("#btn-prev-page").on("click", function(event) {
        params.page = (--params.page > 0 ? params.page : 0);
        renderPage(ijkmgr, params);
      });
      $("#btn-next-page").on("click", function(event) {
        params.page = (++params.page > 1e9 ? 1 : params.page);
        renderPage(ijkmgr, params);
      });
    })
    .catch(function (err) {
      alert(err);
    });
  }

  $(window).on("load", function() {
    var self = this;
    var $vConsolse = new VConsole();
    var tpl = $("#viewport");

    self.ijkmgr = new IJKTPL(tpl, {
      posts: [],
      params: { page: 0 }
    }, { debug: true });
    self.ijkmgr.compile();
    // Splash page.
    $("#viewport").removeClass("ijktpl-tpl");

    var params = loadConfig();

    if (!params) {
      params = {
        tags: "order:date+rating:s",
        limit: 30,
        page: 1
      };
    }

    $(document).on("keydown", function(event) {
      if (event.key === "Enter") {
        $("#btn-search").click();
      }
    });

    renderPage(ijkmgr, params);
  });
})();

// vim: set ts=2 sw=2 ff=unix et:
