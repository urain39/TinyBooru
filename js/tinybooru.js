/**
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
    return new Waiter(function (resolve) {
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

  // Use privately namespace to create helpers
  var helpers = (function() {
    // You can't see me XD
    var date = new Date(),
      helpers = {
        title: function(context) {
          var params = context.resolve(['params', null, null]);
          return params.page ?
            '<h2><b>Viewing</b>&nbsp;&nbsp;<small>{tags}</small></h2>'.format(
              params, IJ2TPL.escape
            )
          :
            '<h2>Welcome to TinyBooru~</h2>';
        },
        fullYear: function(context) {
          return date.getFullYear();
        }
      };
    return helpers;
  })();

  function renderPage(ij2mgr, params) {
    var currPage = params.page;

    fetchPosts(params)
      .then(function (data) {
        if (currPage !== params.page) {
          alert("skip render page {0}.".format([currPage]));
          return;
        }

        ij2mgr.render({
          posts: data,
          params: params,
          helpers: helpers
        });

        // (Re-)Binding event callbacks.
        $("#btn-search").on("click", function(event) {
          if (params.page != 0) {
            params.tags = $("#search-box").val();
          }
          params.page = 1; // Reset.
          renderPage(ij2mgr, params);
        });

        if (params.page < 1) {
          return; // skip page 0.
        }

        saveConfig(params);

        $("#btn-prev-page").on("click", function(event) {
          params.page = (--params.page > 0 ? params.page : 0);
          renderPage(ij2mgr, params);
        });
        $("#btn-next-page").on("click", function(event) {
          params.page = (++params.page > 1e9 ? 1 : params.page);
          renderPage(ij2mgr, params);
        });
      })
      .catch(function (err) {
        alert(err);
      })
    .done();
  }

  $(window).on("load", function() {
    var self = this;
    var $vConsolse = new VConsole();

    self.ij2mgr = {
      template: IJ2TPL.parse(
        $("#viewport-tpl").text()
      ),
      "post-viewer-tpl": IJ2TPL.parse(
        $("#post-viewer-tpl").text()
      ),
      element: $("#viewport"),
      render: function(data) {
        var startTime = new Date().getTime();

        this.element.html(
          this.template.render(data, this)
        );

        if (typeof console !== 'undefined')
          console.log('Render time: {0}ms'.format([
            new Date().getTime() - startTime
          ]));
      }
    };

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

    renderPage(ij2mgr, params);
  });
})();

// vim: set ts=2 sw=2 ff=unix et:
