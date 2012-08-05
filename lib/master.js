var fs=require('fs');
var cluster = require('cluster');

function broadcastMessage(sid, msg) {
  if (!msg || !msg.evt) {
    return;
  }
  msg.sender = sid;
  Object.keys(cluster.workers).forEach(function broadcast(uid) {
    cluster.workers[uid].send(msg);
  });
}

cluster.broadcast = function broadcast(evt) {
  return broadcastMessage(process.pid, { evt:evt, args:Array.prototype.slice.call(arguments, 1) });
};

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

module.exports = exports = function master(options, callbacks) {
  options = options || {};

  var err, idx;
  try {
    if (options.pidfile) {
      fs.writeFileSync(options.pidfile, process.pid, 'utf-8');
      process.once('exit', fs.unlinkSync.bind(fs, options.pidfile));
    }
    
    options.workers = options.workers || require('os').cpus().length;

    cluster.on('exit', workerExit);
    cluster.on('online', function workerOnline(worker) {
      worker.on('message', broadcastMessage.bind(worker.process, worker.process.pid));
    });
    process.on('SIGHUP', disconnectWorkers);
    for (idx=0; idx<options.workers; idx+=1) {
      cluster.fork();
    }
  } catch(ex) {
    err=ex;
  }
  
  callbacks.forEach(function(fn) {
    fn(err, cluster);
  });
};
