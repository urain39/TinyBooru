/*
 *   Copyright 2019 urain39 <urain39@qq.com>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

/*
 * var source = "<p>#{msg}</p>";
 * var mapper = { msg: "Hello" };
 * var ijktpl = new IJKTPL(source, mapper);
 * ijktpl.compile();
 * ijktpl.apply(document.querySelector("body"));
 */

if (typeof assert !== "function") {
  function assert(condition) {
    if (!!!condition) {
      throw new Error("Assertion Failed!");
    }
  }
}

function IJKTPL(source, mapper, options) {
  assert(this instanceof IJKTPL);
  assert(typeof mapper === "object");

  if (typeof options !== "object") {
    options = {
      ignoreCase: false
    };
  }

  this._source = source;
  this._mapper = mapper;
  this._options = options;
  this._rawHtml = "";
  this._tokens = [];
  this._buffer = [];

  if (typeof source === "object") {
    if (typeof source.html === "function") {
      this._source = source.html(); // JQuery
    } else if (typeof source.innerHTML === "string") {
      this._source = source.innerHTML;
    }
  }

  ;((that, map, opts) => {
    if (!!opts["ignoreCase"]) {
      var _map = {};
      for (var key in map) {
        key = key.toLowerCase();
        _map[key] = map[key];
      }
      that._mapper = _map;
    }
  })(this, this._mapper, this._options);
}

IJKTPL.Token = function(id, token, position, options) {
  assert(this instanceof IJKTPL.Token);

  this.id = id;
  this.token = token;
  this.position = position;

  if (!!options["ignoreCase"]) {
      this.token = this.token.toLowerCase();
  }
}

IJKTPL.prototype.apply = function(element) {
  assert(typeof element === "object");

  var rawHtml = "";

  if (typeof element.html === "function") {
    element = element[0]; // Holy shirt!
  }

  if (typeof this._rawHtml === "string" && !!!this._rawHtml) {
    rawHtml = this.compile();
  }
  element.innerHTML = rawHtml;
}

IJKTPL.prototype.preCheck = function() {
  return ((src) => {
    var lastIdx = 0, isClosed = true;
    for (var i = 0; i < src.length; i++) {
      if (src[i] === "#" && src[i + 1] === "{" && isClosed) {
        lastIdx = i;
        isClosed = false;
      } else if (src[i] === "}" && !isClosed) {
        isClosed = true;
      } else if (src[i] === "#" && src[i + 1] === "{" && !isClosed) {
        throw new SyntaxError("No Closing Token at the " + src.substring(lastIdx, i));
      }
    }

    if (!isClosed) {
      throw new SyntaxError("Missing '}' at the " + src.substring(lastIdx, i));
    }
  })(this._source);
}

IJKTPL.prototype.scanTokens = function() {
  this.preCheck();
  return ((that, src, buf) => {
    var tokens = [];
    var i, j, k, l, id = 0,
        lastIdx = 0, tmp, token, fragment;

    buf.splice(0, buf.length); // All empty!
    for (i = 0; i < src.length; i++) {
      if (src[i] === "#" && src[i + 1] === "{") {
        j = i + 2;
        tmp = src.substr(j);
        k = tmp.indexOf("}");

        token = tmp.substring(0, k);
        l = j + k; // Position of the "}"
        tokens.push(new IJKTPL.Token(id, token, [i, l], this._options));
        // lastIdx -> the index after the "}"
        fragment = src.substring(lastIdx, i);

        if (fragment.length !== 0) {
          buf.push(fragment);
        }
        buf.push(id); ++id;
        i = l; lastIdx = l + 1;
      }
    }
    // If src not ends with "}", the last fragment will
    // be lost. So we should check it again to fix that.
    // NOTE: Don't forget `lastIdx = l + 1;`!
    if (lastIdx != src.length) {
        fragment = src.substring(lastIdx, i);
        if (fragment.length !== 0) {
          buf.push(fragment);
        }
    }
    that._tokens = tokens;
    return tokens;
  })(this, this._source, this._buffer);
}

IJKTPL.prototype.compile = function() {
  var tokens = this.scanTokens();

  var rawHtml = "";
  return ((that, buf, map) => {
    var id, token;
    for (var i = 0; i < buf.length; i++) {
      if (typeof buf[i] === "string") {
        rawHtml += buf[i];
      } else if (typeof buf[i] === "number") {
        id = buf[i];
        token = tokens[id].token;
        rawHtml += map[token];
      }
    }
    that._rawHtml = rawHtml;
    return rawHtml;
  })(this, this._buffer, this._mapper);
}

if (typeof exports === "object") {
  exports.IJKTPL = IJKTPL;
}
