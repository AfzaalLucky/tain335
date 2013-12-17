module.exports = (function () {
  'use strict';
  var transport = require('../util/transport');

  return function (req, res, next) {
    if (req.method !== 'POST') return next();
    if (req.body.listId && req.body.campaignId && req.body.url) {
      var listId = req.body.listId
        , campaignId = req.body.campaignId
        , url = req.body.url;
      url.image = undefined;
      transport.updateCampaignUrl(listId, campaignId, url, function (err, data) {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.statusCode = 200;
        return res.end(JSON.stringify(data));
      });
    } else {
      return next();
    }
  };
  
})();