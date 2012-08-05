var cluster=require('cluster');

function noOp() { 
  return this; 
}

function regCb(callbacks, cb) {
  if('function' === typeof cb) {
    callbacks.push(cb);
  }
  return this;
}

var daemon = require('./lib/daemon.js');
var master = require('./lib/master.js');
var worker = require('./lib/worker.js');

module.exports = exports = function SEIC(options) {
  var seic={};
  var callbacks = [];
  if (process.env.NODE_DAEMONIZED !== 'spdy-express-io-cluster') {
    seic.daemon = regCb.bind(seic, callbacks);
    seic.master = noOp;
    seic.worker = noOp;
    process.nextTick(daemon.bind(seic, options, callbacks));
  } else {
    if (cluster.isMaster) {
      seic.daemon = noOp;
      seic.master = regCb.bind(seic, callbacks);
      seic.worker = noOp;
      process.nextTick(master.bind(seic, options, callbacks));
    } else {
      seic.daemon = noOp;
      seic.master = noOp;
      seic.worker = regCb.bind(seic, callbacks);
      process.nextTick(worker.bind(seic, options, callbacks));
    }
  }
  return seic;
};