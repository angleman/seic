var cluster=require('cluster');

exports = module.exports = function main(stdout, stderr, httpsOptions, callback) {
  if (process.env.NODE_DAEMONIZED==='spdy-express-io-cluster') {
    if (cluster.isMaster) {
      exports.startMaster();
    } else {
      exports.startWorker(callback);
    }
  } else {
    exports.startDaemon(stdout, stderr);
  }
};

exports.startDaemon = function startDaemon(stdout, stderr) {
  var fs=require('fs');
  var spawn=require('child_process').spawn;
  stdout = stdout || '/dev/null';
  stderr = stderr || stdout;
  var out = fs.openSync(stdout, 'a');
  var err = fs.openSync(stderr, 'a');
  process.env.NODE_DAEMONIZED='spdy-express-io-cluster';
  spawn(process.argv[0], Array.prototype.slice.call(process.argv, 1), {
    env:process.env,
    detached: true,
    stdio: [ 'ignore', out, err ]
  }).unref();
};

exports.startMaster = require('./lib/master.js');
exports.startWorker = require('./lib/worker.js');
