if (typeof String.prototype.format !== "function") {
  String.prototype.format = function (obj) {
    var self = this;
    return self.replace(/\{([0-9A-Za-z_$]+)\}/g, function(token) {
      var key = token.slice(1, token.length - 1),
          idx = parseInt(key, 10);
      if (typeof idx === "number") {
        key = idx;
      }
      return obj[key];
    });
  };
}
