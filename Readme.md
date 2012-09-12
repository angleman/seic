# SPDY-Express-Socket.IO-Cluster

This is a basic module that simplifies starting projects. 99% of the servers we write are HTTPS Servers that need Socket.IO. SPDY is used by roughly 50% of web users right now (mid 2012), and in NodeJS it's a freeby, so it goes in here for better performance. And of course any decent server will not be run from the command-line, but rather as a daemon that uses the awesome Cluster in NodeJS core.

## Usage

    var options = {
      stdout:'stderr.log',
      stderr:'stdout.log',
      pidfile:'seic.pid',
      ssl:{
        key:require('fs').readFileSync('my-server.key'),
        cert:require('fs').readFileSync('my-server.crt')
      }
    };
    var seic = require('seic')(options).master(function(err, cluster) {
      console.log('This is the master process');
    }).worker(function(err, app) {
      app.get('/', function(req, res, next) {
        res.send(200, 'This is your Server');
      });
      app.listen(443);
      var spdyServer = app.get('spdy');
      var socketIO = app.get('socket.io');
    });


The app object has been slightly modified:
 * The listen method has been overridden to call listen on the spdy server
 * There is a broadcast(eventname[, args...]) method which broadcasts event to all app objects in all worker processes
 * The spdy server has been set with app.set('spdy')
 * The socket.io has been set with app.set('socket.io')
 * The used express module has been set with app.set('express')

Aside from this it is the express app just as described on [the express website](http://expressjs.com)

The cluster object has also been modified:
 * There is a broadcast(eventName[, args]) method that will broadcast the event to all workers

## License

(The MIT License)

Copyright (c) 2012 YOUSURE Taifvergleich GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

**THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.**
