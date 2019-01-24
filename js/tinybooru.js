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
  function fetchPosts() {
    var xhr = new XMLHttpRequest();
    xhr.open("get", "https://yande.re/post/index.json?limit=9&tags=seifuku+rating:s", false);
    xhr.send(null);
    return JSON.parse(xhr.responseText);
  }

  function $(selector) {
    return document.querySelectorAll(selector);
  }

  window.onload = function() {
    var self = this;
    var $vConsolse = new VConsole();
    var tpl = $("#post-viewer")[0]
    self.ijkmgr = new IJKTPL(tpl, {
      posts: fetchPosts()
    }, { debug: true });
    self.ijkmgr.compile();
    tpl.classList.remove("ijktpl-tpl");
  }

  $("#btn-settings")[0].onclick = function() {
    alert("Not implemented yet!");
  }
})();

// vim: set ts=2 sw=2 ff=unix et:
