module.exports = (function () {
  'use strict';
  var valid = require('url-valid')
    , EventEmitter = require('events').EventEmitter
    , transport = require('../util/transport')
    , map = new (require('../util/Map'))()
    , Checker = require('../util/Checker')
    , extract = require('./extract');

  function res(listId, campaignId, urls, callback) {
    var results = []
      , checkList = []
      , list = [];

    function check(v) {
      v.on('check', function (err, valid) {
        // 这里的错误打印出来
        if (err) console.log(err);
        valid ? (v.status = 1) : (v.status = 0);
        results.push({
          url: v.url,
          status: v.status
        });

        callback && callback(results);
        callback = null;
      });
    }

    urls.forEach(function (url) {
      var v = map.get(url);
      if (v) {
        return check(v);
      } else {
        return list.push(url);
      }
    });
    // if list is not empty
    if (list.length) {
      transport.filter(list, function (err, result) {
        // 暂时抛出错误
        if (err) throw err;
        var urlObjs = result.data || [];
        Array.prototype.push.apply(results, urlObjs);
        results.forEach(function (urlObj) {
          urlObj.timestamp = undefined;
        });
        // if all url have extracted before
        if (list.length === urlObjs.length) {
          var _rids = {};
          urlObjs.forEach(function (urlObj) {
            _rids[urlObj.url] = urlObj.id;
            urlObj.rid = urlObj.id;
            urlObj.id = undefined;
          });
          transport.updateCampaignUrls(listId, campaignId, results, function (err, res) {
            if (err) throw err;
            var _list = [];
            res.data.urls.forEach(function (urlObj) {
              if (urlObj.status !== 2) {
                urlObj.rid = _rids[urlObj.url];
                _list.push(urlObj);
              }
            });
            extract.some(listId, campaignId, _list);
            callback(res.data.urls);
          });
        } else {
          var _map = {}
            , _list = [];
          urlObjs.forEach(function (urlObj) {
            _map[urlObj.url] = true;
          });
          list.forEach(function (url) {
            if (!_map[url]) {
              _map[url] = true;
              _list.push(url);
              var v = valid.one(url).on('check', function (err, status) {
                map.remove(url);
                checkList.push({
                  url: url,
                  status: status ? 1 : 0
                });
                if (checkList.length === _list.length) {
                  var checker = new Checker(['addUrls', 'updateCampaignUrls'], function() {
                    var urlObjs = [];
                    checker.urls.forEach(function (urlObj) {
                      urlObj.rid = checker.rUrls[urlObj.url];
                    });
                    extract.some(listId, campaignId, checker.urls);
                  });
                  transport.addUrls(checkList, function (err, result) {
                    if (err) return console.log(err);
                    var rUrls = {};
                    result.data.urls.forEach(function (rUrlObj) {
                      rUrls[rUrlObj.url] = rUrlObj.id;
                    });
                    checkList.forEach(function (urlObj) {
                      urlObj.rid = rUrls[urlObj.url];
                    });
                    transport.updateCampaignUrls(listId, campaignId, checkList, function (err, result) {
                      if (err) return console.log(err);
                      var urls = result.data.urls;
                      urls.forEach(function (urlObj) {
                        urlObj.rid = rUrls[urlObj.url];
                      });
                      extract.some(listId, campaignId, urls);
                    });
                  });
                  
                }
              });
              // avoid error occur, but it's not the best way
              v.emitter.setMaxListeners(0);
              map.set(url, v);
              return check(v, true);
            }
          });
        }
      });
    }
  };

  res.uv = valid;
  return res;
  
})();