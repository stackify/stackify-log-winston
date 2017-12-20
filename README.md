##Stackify Log API for Winston

[![npm version](https://badge.fury.io/js/winston-stackify.svg)](http://badge.fury.io/js/winston-stackify)

Winston transport for Stackify

Errors and Logs Overview:

http://support.stackify.com/errors-and-logs-overview/

Sign Up for a Trial:

http://www.stackify.com/sign-up/

## Installation
```bash
$ npm install stackify-logger
$ npm install winston-stackify
```

## Usage

Using the default logger:

``` js
var winston = require('winston');
var stackify = require('stackify-logger');

stackify.start({apiKey: '***', env: 'dev'});

require('winston-stackify').Stackify;

winston.add(winston.transports.Stackify, {storage : stackify});
```

Instantiating your own logger:

``` js
var winston = require('winston');
var stackify = require('stackify-logger');

stackify.start({apiKey: '***', env: 'dev'});

require('winston-stackify').Stackify;

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.Stackify)(options)
    ]
});
```

The following options could be passed to the start method:
* __apiKey (Required):__ Stackify API key
* __env:__ Environment name. If a Stackify agent is installed, this does not need to be set. If a Stackify agent is not installed, this should be set to the environment name.
* __proxy:__ HTTP proxy
* __debug:__ Enables internal debug logging for troubleshooting. Defaults to false.

The Stackify Winston transport takes the following options:
* __storage (Required):__ Stackify logging library instance. You should specify it directly by passing stackify-logger module instance.
* __level:__ Level of messages that this transport should log.
* __silent:__ Boolean flag indicating whether to suppress output, defaults to false.
* __handleExceptions:__ Property set to false by default for this transport because Stackify Logger Library handles exceptions itself already. If you're not using default logger and instantiating your own, you don't need to set this option for Stackify transport.

## Troubleshooting

If logging isn't working, enable internal debug logging for Stackify by setting the debug flag in the Stackify options.

```js
stackify.start({apiKey: '***', env: 'dev', debug: true});
```

You will see `stackify-debug.log` in your application's directory.

## License

Copyright 2014 Stackify, LLC.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
