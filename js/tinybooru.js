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

(() => {
  var _onload = window.onload;

  window.onload = function() {
    var tpls = document.querySelectorAll("#main-container .image-preview-tpl");
    tpls.forEach(function(tpl) {
      var ijktpl = new IJKTPL(tpl, {
        file_url: "/",
        sample_url: "https://konachan.net/sample/f2fd16b634638e0f025ad845162f4642/Konachan.com%20-%20276790%20sample.jpg"
      });
      ijktpl.apply(tpl);
    });

    if (typeof _onload === "function") {
      _onload.apply(this);
    }
  }
})();

// vim: set ts=2 sw=2 ff=unix et:
