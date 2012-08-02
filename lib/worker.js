var spdy = require('spdy');
var express = require('express');
var socketio = require('socket.io');

function broadcast(evt) {
  process.send({ evt:evt, args:Array.prototype.slice.call(arguments, 1) });
}

function receiver(app, msg) {
  if (!msg || !msg.evt) {
    return;
  }
  app.emit.apply(app, [ msg.evt ].concat(msg.args));
}

module.exports = exports = function startWorker(httpsOptions, callback) {
  var app = express();
  var srv = spdy.createServer(httpsOptions, app);
  var sio = socketio.listen(srv);

  app.set('spdy', srv);
  app.set('socket.io', sio);
  app.listen = srv.listen.bind(srv);
  app.broadcast = broadcast;
  process.on('message', receiver.bind(app));

  callback(undefined, app, srv, sio);
};
