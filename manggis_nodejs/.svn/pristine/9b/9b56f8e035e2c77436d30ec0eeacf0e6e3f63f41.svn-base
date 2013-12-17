module.exports = (function (domain) {
  'use strict';
  var http = require('http')
    , URL = require('url');

  /**
   * makeRequest
   * @param {String} api
   * @param {Stirng} method, should be 'GET', 'POST', 'PUT'
   * @param {Object} data
   * @param {Function} callback
   */
  function makeRequest(api, method, data, callback) {
    console.log(api);
    // console.log(data);
    var opts = URL.parse(api)
      , req;
    opts.method = method;
    opts.headers = {
      'Content-Type': 'application/json'
    };
    opts.agent = false;
    req = http.request(opts, function (res) {
      var string = ''
      res.setEncoding('utf8');
      res.on('data', function (data) {
        string += data;
      });
      res.on('end', function () {
        console.log(string);
        callback(null, JSON.parse(string));
      });
    });
    req.on('error', function (e) {
      callback(e);
    });
    data && req.write(JSON.stringify(data));
    req.end();
  }

  /**
   * getCampaignUrls
   * @param {String} campaignId
   * @param {Function} callback
   */
  function getCampaignUrls(listId, campaignId, callback) {
    return makeRequest(domain + 'list/' + listId + '/campaign/' + campaignId + '/getCampaignUrls.json', 'GET', null, callback);
  }

  /**
   * filter
   * @param {Array} urls, e.g.['http://www.baidu.com', 'http://www.google.com']
   * @param {Function} callback
   */
  function filter(urls, callback) {
    return makeRequest(domain + 'url/infos.json', 'POST', urls, callback);
  }

  /**
   * addUrls
   * @param {Array} urls
   * @param {Function} callback
   */
  function addUrls(urls, callback) {
    return makeRequest(domain + 'url/addUrls.json', 'POST', {
      urls: urls
    }, callback);
  }

  /**
   * updateCampaignUrls
   * @param {String} campaignId
   * @param {Array} urls
   * @param {Function} callback
   */
  function updateCampaignUrls(listId, campaignId, urls, callback) {
    return makeRequest(domain + 'lists/campaigns/' + campaignId + '/updateUrlInfos.json', 'PUT', {
      urls: urls
    }, callback);
  }

  /**
   * updateUrl
   * @param {Object} url
   * @param {Function} callback
   */
  function updateUrl(url, callback) {
    return makeRequest(domain + 'url/updateInfo.json', 'PUT', url, callback);
  }

  /**
   * updateCampaignUrl
   * @param {Stirng} campaignId
   * @param {Stirng} url
   * @param {Function} callback
   */
  function updateCampaignUrl(listId, campaignId, url, callback) {
    return makeRequest(domain + 'lists/campaigns/' + campaignId + '/updateUrlInfo.json', 'PUT', url, callback);
  }

  return {
    getCampaignUrls: getCampaignUrls,
    filter: filter,
    addUrls: addUrls,
    updateCampaignUrls: updateCampaignUrls,
    updateUrl: updateUrl,
    updateCampaignUrl: updateCampaignUrl
  };

})('http://controller.manggis.internal/controller/');