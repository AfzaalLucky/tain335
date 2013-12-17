'use strict';

var fs = require('fs')
  , crypto = require('crypto')
  , md5 = function(str, encoding){
      return crypto
        .createHash('md5')
        .update(str)
        .digest(encoding || 'hex');
    };

module.exports = function (options){
  var options = options || {}
    , maxAge = options.maxAge || 86400000
    , cache;

  return function unkonw(req, res, next){
    if (cache) {
      res.writeHead(200, cache.headers);
      res.end(cache.body);
    } else {
      fs.readFile('./unknow.png', function(err, buf){
        if (err) return next(err);
        cache = {
          headers: {
              'Content-Type': 'image/png'
            , 'Content-Length': buf.length
            , 'ETag': '"' + md5(buf) + '"'
            , 'Cache-Control': 'public, max-age=' + (maxAge / 1000)
          },
          body: buf
        };
        res.writeHead(200, cache.headers);
        res.end(cache.body);
      });
    }
  };
};