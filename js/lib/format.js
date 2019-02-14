if (typeof String.prototype.format !== "function") {
  String.prototype.format = function (obj) {
    var self = this;
    return self.replace(/\{([0-9A-Za-z_$]+)\}/g, function(token) {
      var key = token.substring(1, token.length - 1);
      key = Number(key) || key;
      return obj[key] || "";
    });
  };
}
