/*!
 * Checker
 * Copyright(c) 2013 Daniel Yang <miniflycn@justany.net>
 * MIT Licensed
 */

module.exports = (function () {
  function Checker (checkList, callback) {
    var checkCache = {};
    for (var i = checkList.length; i--;) {
      checkCache[checkList[i]] = false;
    }
    this.checkList = checkCache;
    this.callback = callback;
    this.allDone = false;
  }
  Checker.prototype.done = function (something) {
    if (this.allDone) {
      return this.callback();
    }
    var checkList = this.checkList
      , i;
    if (!checkList[something]) {
      checkList[something] = true;
    }
    for (i in checkList) {
      if (!checkList[i]) {
          return;
      }
    }
    this.allDone = true;
    this.callback();
  };

  return Checker;
  
})();