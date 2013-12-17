module.exports = (function () {
  'use strict';
  var ue = require('url-extract')()
    , path = './snapshot/campaign/';

  return function (req, res, next) {
    if (req.query.campaignId && req.query.url) {
      var image = path + req.query.campaignId + '.png'
        , url = req.query.url
        , domain = 'http://controller.manggis.internal'
        , job;

      if (~url.indexOf(domain)) {
        job = ue.extract(url, {
          image: image,
          viewportSize: {
            width: 420, 
            height: 300
          },
          clipRect: {
            top: 0, 
            left: 0, 
            width: 420, 
            height: 300 
          },
          zoomFactor: 0.6
        });
      }

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.statusCode = 200;
      return res.end(JSON.stringify({
        code: job ? 0 : 1
      }));
        
    } else {
      next();
    }
  }
  
})();