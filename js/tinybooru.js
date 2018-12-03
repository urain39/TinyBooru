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

var TinyBooru = (function() {
  if (typeof(this.TinyBooru)==='undefined') {
    return {
      init: function() {
        this.ui.init();
        this.tpls.init();
        this.tools.init();
        this.events.init();
        this.settings.init();
      },
      ui: {
        init: function() {
          // TODO:
        }
      },
      tpls: {
        init: function() {
          // TODO:
        }
      },
      tools: {
        init: function() {
          // NOTE: Do Nothing.
        },
        pack_all: function() {
          // TODO:
        },
        pack_selected: function() {
          // TODO:
        }
      },
      events: {
        init: function() {
          $("#btn-refresh").on("click", function() {
            location.reload(true);
          });
          $("#btn-show-settings").on("click", function() {
            $("#settings-modal").removeClass("hide");
          });
        }
      },
      settings: {
        load: function() {
          // TODO: load the settings from cookies
        },
        save: function() {
          // TODO: save the settings from cookies
        },
        init: function() { this.load(); },
        exit: function() { this.save(); }
      }
    }
  }
})()

TinyBooru.init();

// vim: set ts=2 sw=2 ff=unix et:
