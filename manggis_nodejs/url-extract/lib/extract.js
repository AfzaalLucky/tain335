module.exports = (function () {
  'use strict';
  var ue = require('url-extract')()
    , valid = require('url-valid')
    , transport = require('../util/transport')
    , map = new (require('../util/Map'))()
    , path = './snapshot/template/';

  function some(listId, campaignId, urls) {
    console.log('extract some');
    urls.forEach(function (urlObj) {
      var job = ue.extract(urlObj.url, {
        id: urlObj.rid,
        image: path + urlObj.rid + '.png',
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
        zoomFactor: 0.6,
        callback: function (job) {
          console.log(job);
          transport.updateUrl({
            id: urlObj.rid,
            url: job.url,
            title: job.title,
            description: job.description,
            status: job.status ? 2 : undefined
          }, function (err, data) {
            // 处理错误
            transport.updateCampaignUrl(listId, campaignId, {
              id: urlObj.id,
              url: job.url,
              title: job.title,
              description: job.description,
              status: job.status ? 2 : undefined
            }, function (err, data) {
              // 处理错误
              // 清除对应job
              map.remove(job.url);
            });
          });
        }
      });
      map.set(urlObj.url, job);
    });
  }

  function one(url, callback) {
    valid.one(url, function (err, valid) {
      if (valid) {
        transport.addUrls([{
          url: url,
          status: valid ? 1 : 0
        }], function (err, result) {
          if (err) throw err;
          var job = ue.extract(url, {
            id: result.data.urls[0].id,
            image: path + result.data.urls[0].id + '.png',
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
            zoomFactor: 0.6,
            callback: function (job) {
              transport.updateUrl({
                id: job.id,
                url: job.url,
                title: job.title,
                description: job.description,
                status: job.status ? 2 : undefined
              }, function (err, data) {});
              callback({
                rid: job.id,
                url: job.url,
                status: job.status ? 2 : undefined,
                title: job.title,
                description: job.description
              });
            }
          });
        });
      }
    });
  }

  function getExtract(url, callback) {
    var job = map.get(url)
      , _callback;
    if (job) {
      // 临时处理方法，未来可能修改
      _callback = job.callback;
      job.callback = function (job) {
        callback({
          id: job.id,
          url: job.url,
          title: job.title,
          description: job.description,
          status: job.status ? 2 : undefined
        });
        _callback(job);
      }
    } else {
      transport.filter([url], function (err, res) {
        if (err) throw err;
        if (res.code !== 0) {
          callback(true);
        } else {
          if (res.data.length) {
            callback(null, res.data[0]);
          } else {
            callback(true);
          }
        }
      });
    }
  }
  
  return {
    some: some,
    one: one,
    getExtract: getExtract
  };

})();