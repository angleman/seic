var cluster = require('cluster');

function broadcastMessage(msg) {
  if (!msg || !msg.evt) {
    return;
  }
  Object.keys(cluster.workers).forEach(function broadcast(uid) {
    cluster.workers[uid].send(msg);
  });
}

function workerExit(worker) {
  if (worker.suicide) {
    return;
  }
  cluster.fork();
}

function disconnectWorkers() {
  Object.keys(cluster.workers).forEach(function broadcast(uid) {
    cluster.workers[uid].disconnect();
  });
}

module.exports = exports = function startMaster() {
  cluster.on('exit', workerExit);
  cluster.on('online', function workerOnline(worker) {
    worker.on('message', broadcastMessage);
  });
  process.on('SIGHUP', disconnectWorkers);
  require('os').cpus().forEach(function() {
    cluster.fork();
  });
};
