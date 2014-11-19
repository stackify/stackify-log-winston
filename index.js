var events   = require('events'),
    util     = require('util'),
    winston  = require('winston');
//
// ### function Stackify ()
// Constructor function for the Stackify transport object responsible
// for persisting log messages and metadata to a memory array of messages and sending them to Stackify API.
//
module.exports = Stackify = winston.transports.Stackify = function (options) {
    
    if (!options.storage) {
        throw new TypeError('You have to pass Stackify logger instance');
    }

    winston.Transport.call(this, options);
    options = options || {};
    this.level = options.level || 'silly';
    this.push = options.storage.push;
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
    var self = this;

    if (this.silent) {
        return callback(null, true);
    }

    this.push(level, msg, meta);

    self.emit('logged');
    callback(null, true);
};