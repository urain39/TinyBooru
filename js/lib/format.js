if (typeof String.prototype.format !== "function") {
  String.prototype.format = function (mappable, filter) {
    var self = this;
    return self.replace(/\{([0-9A-Za-z_$]+)\}/g, filter ?
      function(_, key) { return filter(mappable[key]); }
    :
      function(_, key) { return mappable[key]; }
    );
  };
}