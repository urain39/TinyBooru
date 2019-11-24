if (typeof String.prototype.format !== "function") {
  String.prototype.format = function (map) {
    var self = this;
    return self.replace(/\{([0-9A-Za-z_$]+)\}/g, function(match, key) {
      return map[key];
    });
  };
}