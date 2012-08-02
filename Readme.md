# SPDY-Express-Socket.IO-Cluster

This is a basic module that simplifies starting projects. 99% of the servers we write are HTTPS Servers that need Socket.IO. SPDY is used by roughly 50% of web users right now (mid 2012), and in NodeJS it's a freeby, so it goes in here for better performance. And of course any decent server will not be run from the command-line, but rather as a daemon that uses the awesome Cluster in NodeJS core.

## Usage
    var stderr = 'stderr.log';
    var stdout = 'stdout.log';
    var httpsOptions = {
      key:require('fs').readFileSync('my-server.key'),
      cert:require('fs').readFileSync('my-server.crt')
    };
    var seic = require('spdy-express-io-cluster.js');
    seic(stdout, stderr, httpsOptions, function workerSetup(err, app) {
      app.get('/', function(req, res, next) {
        res.send(200, 'This is your Server');
      });
      app.listen(443);
      var spdyServer = app.get('spdy');
      var socketIO = app.get('socket.io');
    });

The seic function daemonizes the process and starts up as many workers as there are cpu cores. It takes 4 parameters:
 
 1. stdout is a string containing the file where stdout should be written to (default /dev/null)
 1. stderr is a string containint the file where stderr should be written to (default stdout)
 1. httpsOptions is an object containing the general httpsOptions as described in the [NodeJS Documentation](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener)
 1. a callback that is called in each worker process. The callback is only called on Worker Processes. It takes 2 parameters. The first is an Error object (if applicable) and the second is the Express app object. This callback is where you set up your express application and then call app.listen(port).

The app object has been slightly modified:

 * The listen method has been overridden to call listen on the spdy server
 * There is a broadcast(eventname[, args...]) method which broadcasts event to all app objects in all worker processes
 * The spdy server has been set with app.set('spdy')
 * The socket.io has been set with app.set('socket.io')

Aside from this it is the express app just as described on [the express website](http://expressjs.com)

## License

(The MIT License)

Copyright (c) 2012 YOUSURE Taifvergleich GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

**THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.**
