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

(function (global) {
  var ST_PENDING = 0,
      ST_RESOLVED = 1,
      ST_REJECTED = 2;

  function Runthen(executor) {
    var self = this;
    self._state = ST_PENDING;
    self._executor = executor;
    self._resolveList = [];
    self._onCatch = null;
  }

  Runthen.prototype.then = function (resolve) {
    var self = this;
    self._resolveList.push(resolve);
    return self;
  };

  Runthen.prototype.catch = function (onCatch) {
    var self = this;
    self._onCatch = onCatch;
    return self;
  };

  Runthen.prototype.destroy = function () {
    var self = this;
    self._resolveList.length = 0;
    self._onCatch = null;
  };

  Runthen.prototype.done = function () {
    var self = this,
        context = null,
        resolve = null,
        onCatch = null;
    if (self._state !== ST_PENDING) {
      return; // State has been changed, so just ignore it.
    }
    // The executor's callback
    resolve = function (value) {
      context = value;
      // Handle Promise-like then-chains.
      while (self._resolveList.length > 0) {
        // Amazing right? XD
        resolve = self._resolveList.shift();
        // Call callbacks one by one.
        try {
          context = resolve(context);
        } catch (error) {
          onCatch = self._onCatch;
          if (typeof onCatch === "function") {
            onCatch(error);
          }
          // Mark state is rejected.
          self._state = ST_REJECTED;
          break;
        }
      }
      // Whatever, destroy it first.
      self.destroy();
      if (self._state === ST_REJECTED) {
        return; // State changed.
      }
      // Mark state is resolved.
      self._state = ST_RESOLVED;
    };
    // Call the executor directly(main-thread).
    self._executor(resolve);
  };

  global.Runthen = Runthen;
})(this);
