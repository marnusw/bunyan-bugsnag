# Bunyan Bugsnag Stream

[Bugsnag](https://www.bugsnag.com/) is great for tracking errors. Even when an error is
handled it is often still desired to log that error on Bugsnag using the `bugsnag.notify()`
method. When [Bunyan](https://github.com/trentm/node-bunyan) is used for logging errors
are already being logged throughout an app; this stream allows sending logged errors to
Bugsnag without adding Bugsnag calls in the application code as well.

Requires Node.js `v4.7.3` or higher.

## Installation

Install via `npm`:

```
npm i bunyan-bugsnag
```

or with the peer dependencies:

```
npm i bunyan-bugsnag bunyan bugsnag
```

## Usage

Just add a `bugsnagStream()` to the Bunyan streams already in use: 

```javascript
import bugsnagStream from 'bunyan-bugsnag'

const logger = bunyan.createLogger({
  name: 'appName',
  streams: [{
    level: 'info',
    stream: process.stdout,
  },
  {
    type: 'raw',
    level: 'warn',
    stream: bugsnagStream(),
  }],
})
```

Specifying the `raw` type is optional, but improves efficiency.

The stream takes the following basic options. All are optional, with these values as defaults:

```javascript
bugsnagStream({
  systemInfo: ['name', 'hostname', 'pid', 'req_id', 'level', 'time', 'v'],
  warningLevel: 'warn',
  errorLevel: 'error',
})
```

Use the `warningLevel` and `errorLevel` settings to specify which severity will be
indicated to Bugsnag. For example, to send `log.error()` calls as a `warning` and only
`log.fatal()` calls as errors set `errorLevel: 'fatal'`. Any level below `warningLevel` 
will be sent with `info` severity if the Bunyan stream config `level` is set to pass 
lower levels in the first place. *Levels can be specified by name or as a number.*

The `systemInfo` option determines which fields in the logged object will be sent as
`system` info with the remaining items sent as `info`. The equivalent call would be:

```javascript
bugsnag.notify(error, {
  system: {
    name: 'appName',
    hostname: 'HostName',
    pid: 25540,
    req_id: 'a4f81850-f5e4-11e6-9a41-7f186ecc7af4',
    level: 50,
    time: '2017-02-18T14:15:05.126Z',
    v: 0,
  },
  info: {
    msg: 'Something bad happened!',
    // Any other properties passed to the bunyan log method ...
  }
})
```

This will create `system` and `info` tabs in the Bugsnag report providing this information.

##### Bugsnag configuration

The official Node.js Bugsnag client works as a singleton instance and is also imported and used 
internally by this library. This means the Bugsnag configuration applied elsewhere will also apply
to this stream.

If this stream is the only place where Bugsnag is used, the `bugsnagApiKey` can be provided as an 
option for convenience.

```javascript
bugsnagStream({
  bugsnagApiKey: 'bugsnag-api-key-here',
  // other options
})
```

If it is ever desired to specify a specific `bugsnag` instance other than the one imported by this 
stream it can be overridden by passing it in as an option.

```javascript
const bugsnag = require('bugsnag')

bugsnag.register('bugsnag-api-key-here')

bugsnagStream({
  bugsnag,
  // other options
})
```


## Contributing

Any thoughts/PRs are welcome.


## License

This software is free to use under the MIT license.
See the [LICENSE file](/LICENSE.md) for license text and copyright information.
