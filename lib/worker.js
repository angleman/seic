var spdy = require('spdy');
var express = require('express');
var socketio = require('socket.io');

function broadcast(evt) {
  process.send({ evt:evt, sender:process.pid, args:Array.prototype.slice.call(arguments, 1) });
}

function receiver(app, msg) {
  if (!msg || !msg.evt || !msg.sender) {
    return;
  }
  app.emit.apply(app, [ msg.evt, msg.sender ].concat(msg.args));
}

if ('function' !== typeof process.send) {
  process.send = process.emit.bind(process, 'message');
}

module.exports = exports = function worker(options, callbacks) {
  var err;
  try {
    var app = express();
    var srv = spdy.createServer(options.ssl, app);
    var sio = socketio.listen(srv);

    app.set('express', express);
    app.set('spdy', srv);
    app.set('socket.io', sio);
    app.listen = srv.listen.bind(srv);
    app.broadcast = broadcast;
    process.on('message', receiver.bind(app, app));
  } catch(ex) {
    err = ex;
  }
  callbacks.forEach(function(fn) {
    fn(err, app, srv, sio);
  });
};
