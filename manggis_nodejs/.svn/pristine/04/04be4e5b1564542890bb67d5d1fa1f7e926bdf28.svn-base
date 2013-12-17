module.exports = (function () {
  'use strict';

    var transport = {};

    transport.getCampaignUrls = function (listId, campaignId, callback) {
      setTimeout(function () {
        callback(null, {
          code: 0,
          urls: [{
            id: 0,
            url: 'http://web.com',
            title: 'title',
            description: 'description'
          }]
        });
      }, 0);
    };

    transport.filter = function (urls, callback) {
      setTimeout(function () {
        callback(null, {
          code: 0,
          data: []
        });
      }, 0);
    };

    transport.addUrls = function (urls, callback) {
      setTimeout(function () {
        callback(null, {
          code: 0,
          data: {
            urls: [{
              id: 0,
              url: 'http://www.baidu.com',
              status: 1
            }]
          }
        });
      }, 0);
    };

    transport.updateCampaignUrls = function (listId, campaignId, url, callback) {
      setTimeout(function () {
        callback(null, {
          code: 0,
          data: {
            urls: [{
              id: '1',
              url: 'http://www.baidu.com',
              status: 1
            }]
          }
        });
      }, 0);
    };

    transport.updateUrl = function (url, callback) {
      setTimeout(function () {
        callback(null, {
          code: 0
        });
      }, 0);
    };

    transport.updateCampaignUrl = function (listId, campaignId, data, callback) {
      setTimeout(function () {
        callback(null, {
          code: 0
        });
      }, 0);
    };

    return transport;

})();