module.exports = (function () {
  'use strict';
  var cluster = require('cluster');
    
  if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', function (worker) {
      console.log('Server ' + worker.id + ' died :(');
      process.nextTick(function () {
        cluster.fork();
      });
    });
  } else {
    require('./lib/server.js');
  }
})();