var qs        = require('querystring');
var http      = require('http');
var winston   = require('winston');
var util      = require('util');
var test      = require('./test');
var stackify  = require('../stackify-log-nodejs/index');
var logger    = require('./logger');

stackify.start({apiKey: '0Zw8Fj4Hr3Aa1Sf2Gw4Cb3Gk7Fp6Zn6Sc0Gw2Cr', env: 'dev'});

require('./index');
require('./test2');
/*winston.add(winston.transports.Stackify, {level: 'silly', storage: stackify});*/

logger.log('verbose', 'wert');
logger.info('info');
logger.error('debug');
logger.log('tretretre', 'sdf');
logger.log('verbose', 'were43rt');
logger.log('info', 'interpolated %s', 'string');
logger.log('info', 'interpolated %d', 445);
sdf;

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