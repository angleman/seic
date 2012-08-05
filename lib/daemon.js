var fs=require('fs');
var spawn=require('child_process').spawn;

module.exports = exports = function daemon(options, callbacks) {
  options = options || {};
  options.stdout = options.stdout || '/dev/null';
  options.stderr = options.stderr || '/dev/null';

  var err;
  try {
    var stdin = (('string' === typeof options.stdin) ? fs.openSync(options.stdin, 'r') : options.stdin) || 'ignore';
    var stdout = (('string' === typeof options.stdout) ? fs.openSync(options.stdout, 'a') : options.stdout) || 'ignore';
    var stderr = (('string' === typeof options.stderr) ? fs.openSync(options.stderr, 'a') : options.stderr)  || 'ignore';
    
    process.env.NODE_DAEMONIZED='spdy-express-io-cluster';

    spawn(process.argv[0], Array.prototype.slice.call(process.argv, 1), {
      env:process.env,
      detached: true,
      stdio: [ stdin, stdout, stderr ]
    }).unref();
  } catch(ex) {
    err=ex;
  }
  

  callbacks.forEach(function(fn) {
    fn(err);
  });
};
