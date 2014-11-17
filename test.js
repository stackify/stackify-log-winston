var qs        = require('querystring');
var http      = require('http');
var winston   = require('winston');
var util      = require('util');
var test      = require('./test');
var stackify  = require('../stackify-log-nodejs/index');

stackify.start({apiKey: '0Zw8Fj4Hr3Aa1Sf2Gw4Cb3Gk7Fp6Zn6Sc0Gw2Cr', env: 'dev'});

require('./index');
require('./test2');


winston.add(winston.transports.Stackify, {level: 'silly', storage: stackify});

winston.log('verbose', 'wert');
winston.info('info');
winston.error('debug');
winston.log('debug', 'sdf');
winston.log('verbose', 'were43rt');

setInterval(function () {
    winston.info('test');
}, 4000);
setInterval(function () {
    stackify.info('test');
}, 5000);


http.createServer(function (req, res) {
    var u = url.parse(req.url, true).query;
    var body = '';

    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('data', function (chunk) {
        console.log('data');
    });
    req.on('end', function () {
        console.log('end');
    })
    req.on('end', function () {
        var json = qs.parse(body);
        console.log(body);
        console.log('POSTed: ' + util.inspect(json));
        res.writeHead(200, [
            ['Content-Type', 'text/plain'],
            ['Set-Cookie', 'mycookie1=value1'],
            ['Set-Cookie', 'mycookie2=value2']
        ]);

    });

    }).listen(6789);

console.log('Server running');