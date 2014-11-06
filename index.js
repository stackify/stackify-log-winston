var events = require('events'),
    util = require('util'),
    winston = require('winston'),
    stackify = require('stackify-logger');

//
// ### function Stackify ()
// Constructor function for the Stackify transport object responsible
// for persisting log messages and metadata to a memory array of messages and sending them to Stackify API.
//
var Stackify = winston.transports.Stackify = function () {
    this.lastSent = Date.now();
    this.output = [];
    this.flag = true; // flag that indicates if logs are being sent properly. if false then new batches of messages won't be sent.
    this.fail_counter = 0; //number of failed attempts of sending logs
    this.timeout = undefined;
};

//
// Inherit from `winston.Transport`.
//
util.inherits(Stackify, winston.Transport);

//
// Expose the name of this Transport on the prototype
//
Stackify.prototype.name = 'stackify';

//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Winston. Metadata is optional.
//
Stackify.prototype.log = function (level, msg, meta, callback) {
    if (this.silent) {
        return callback(null, true);
    }

    var self = this,
        output = {level: level, msg: msg, meta: meta};

    if (level === 'error' || level === 'debug') {
        this.output.push(output);
    } else {
        this.output.push(output);
    }

    if (this.flag && this.output.length >= stackify.CONFIG.MSG_LIMIT && stackify.CONFIG.APP_DETAILS) {
        this.sendLogs();

        self.emit('logged');
        callback(null, true);
    }
};

Stackify.prototype.clearLogs = function () {
    this.errorOutput = [];
    this.writeOutput = [];
};

Stackify.prototype.sendLogs = function () {
    var self = this,
        arr = this.output,
        data = arr.slice(0, stackify.CONFIG.MSG_LIMIT),
        success = function() {
            self.fail_counter = 0;

            arr = arr.slice(stackify.CONFIG.MSG_LIMIT);

            if (arr.length >= stackify.CONFIG.MSG_LIMIT) {
                sendLogs();
            } else {
                self.flag = true;
                self.lastSent = Date.now();

                if (self.timeout) {
                    clearTimeout(self.timeout);
                }
                
                self.timeout = setTimeout(self.checkLogs.bind(self), stackify.CONFIG.SCAN_TIMER);
            }
        },
        fail = function(arr) {
            self.flag = false;
            self.fail_counter += 1;

            setTimeout(function() {
                sendLogs()
            }, stackify.CONFIG.REQUEST_TIMER);
        };
        
    if (this.fail_counter <= stackify.CONFIG.REQUEST_ATTEMPTS) {
        stackify.postLogs(data, success, fail);
    }
};

Stackify.prototype.checkLogs = function () {
    var length = this.output(length);
    if (Date.now() - this.lastSent > stackify.CONFIG.SCAN_TIMER * 1000 && this.flag) {
        this.sendLogs(this.output);
    }
};
