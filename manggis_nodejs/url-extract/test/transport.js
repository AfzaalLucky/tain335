module.exports = (function () {
  'use strict';

  var assert = require('assert')
    , transport = require('../util/transport');

  // require('./mock/transport')(transport);

  describe('transport', function () {
    it('should get all result', function (done) {
      transport.filter(['http://www.baidu.com'], function (err, result) {
        console.log(err);
        console.log(result);
        done();
      });
    });
  });
})();