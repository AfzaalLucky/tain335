module.exports = (function () {
  'use strict';

  var assert = require('assert')
    , connect = require('connect')
    , valid = require('../lib/valid')
    , transport = require('../util/transport');

  // require('./mock/transport')(transport);

  var oneTime = true;
  var testSever = connect()
                  .use('/validate', function (req, res, next) {
                    res.end('<html><head><title>test</title><meta name="description" content="Just a test." /></head></html>')
                  })
                  .use('/oneTime', function (req, res, next) {
                    if (oneTime) {
                      oneTime = false;
                      setTimeout(function () {
                        res.end('<html><head><title>test</title><meta name="description" content="Just a test." /></head></html>')
                      }, 1000);
                    }
                  })
                  .listen(7777);

  describe('valid', function () {
    it('should get all result', function (done) {
      valid(1, ['http://localhost:7777/validate'], function (urls) {
        urls.length.should.equal(1);
        urls[0].url.should.equal('http://localhost:7777/validate');
        urls[0].status.should.equal(1);
        done();
      });
    });

    it('should able to check a url just one time', function (done) {
      valid(1, ['http://localhost:7777/oneTime'], function (urls) {
        urls.length.should.equal(1);
        urls[0].url.should.equal('http://localhost:7777/oneTime');
        urls[0].status.should.equal(1);
      });
      setTimeout(function () {
        valid(2, ['http://localhost:7777/oneTime'], function (urls) {
          urls.length.should.equal(1);
          urls[0].url.should.equal('http://localhost:7777/oneTime');
          urls[0].status.should.equal(1);
          done();
        });
      }, 200);
    });
  });

})();