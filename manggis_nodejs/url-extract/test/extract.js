module.exports = (function () {
  'use strict';

  var assert = require('assert')
    , extract = require('../lib/extract')
    , transport = require('../util/transport');

  // require('./mock/transport')(transport);

  describe('extract', function () {
    it('should able get one result', function (done) {
      extract.one('http://www.baidu.com', function (data) {
        done();
      });
    });

    // it('should able run some extract', function (done) {
    //   extract.some('12', [{
    //     rid: '52565bef30047ee26d81ec24',
    //     id: '1',
    //     url: 'http://www.baidu.com'
    //   }]);
    // });
  });

})();