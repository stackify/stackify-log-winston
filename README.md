##Stackify Log API for Winston

Winston transport for Stackify

Errors and Logs Overview:

http://docs.stackify.com/m/7787/l/189767

Sign Up for a Trial:

http://www.stackify.com/sign-up/

## Installation
```bash
$ npm install winston
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

In order to use this transport `stackify-logger` package must be installed

For more details go to [Stackify-Logger](https://github.com/stackify/stackify-log-nodejs)

Stackify transport takes the following options. 'storage' is required:
* __storage:__ Stackify logging library instance. You should specify it directly by passing stackify-logger module instance.
* __level:__ Level of messages that this transport should log, defaults to 'silly'.
* __silent:__ Boolean flag indicating whether to suppress output, defaults to false.
* __handleExceptions:__ property set to false by default for this transport because Stackify Logger Library handles exceptions itself already. If you're not using default logger and instantiating your own, you don't need to set this option for Stackify transport.

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
