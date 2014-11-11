var events   = require('events'),
    util     = require('util'),
    winston  = require('winston'),
    stackify = require('stackify-logger');

//
// ### function Stackify ()
// Constructor function for the Stackify transport object responsible
// for persisting log messages and metadata to a memory array of messages and sending them to Stackify API.
//
var Stackify = winston.transports.Stackify = function () {
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
        output = {Msg: msg, Level: level.toUpperCase(), EpochMs: Date.now(), meta: meta};

    if (level === 'error') {
        stackify.storage.push(stackify.checkError(stackify.storage));
    } else {
        stackify.storage.push(output);
    }

    if (this.flag && stackify.storage.length >= stackify.CONFIG.MSG_LIMIT && stackify.CONFIG.APP_DETAILS) {
        this.sendLogs();

        self.emit('logged');
        callback(null, true);
    }
};

Stackify.prototype.clearLogs = function () {
    stackify.storage = [];
};

Stackify.prototype.sendLogs = function (len) {
    var self = this,
        arr = stackify.storage,
        length = len || stackify.CONFIG.MSG_LIMIT,
        data = arr.slice(0, length),
        success = function () {
            self.fail_counter = 0;
            self.flag = false;

            arr = arr.slice(length);

            if (arr.length >= stackify.CONFIG.MSG_LIMIT) {
                Stackify.prototype.sendLogs();
            } else {
                self.flag = true;

                if (self.timeout) {
                    clearTimeout(self.timeout);
                }

                self.timeout = setTimeout(self.checkLogs.bind(self), stackify.CONFIG.SCAN_TIMER);
            }
        },
        fail = function () {
            self.flag = false;
            self.fail_counter += 1;

            setTimeout(function () {
                stackify.postLogs(data, success, fail);
            }, stackify.CONFIG.REQUEST_TIMER);
        };

    if (this.fail_counter <= stackify.CONFIG.REQUEST_ATTEMPTS) {
        stackify.postLogs(data, success, fail);
    }
};

Stackify.prototype.checkLogs = function () {
    var length = stackify.storage.length;
    if (this.flag) {
        this.sendLogs(length);
    }
};