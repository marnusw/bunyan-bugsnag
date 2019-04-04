# Bunyan Bugsnag Stream

[Bugsnag](https://www.bugsnag.com/) is great for tracking errors. Even when an error is
handled it is often still desired to log that error on Bugsnag using the `bugsnag.notify()`
method. When [Bunyan](https://github.com/trentm/node-bunyan) is used for logging errors
are already being logged throughout an app; this stream allows sending logged errors to
Bugsnag without adding Bugsnag calls in the application code as well.

Requires Node.js `v6.17.0` or higher.

## Installation

Install via `npm` or `yarn`:

```
npm i bunyan-bugsnag bunyan @bugsnag/js
```

## Usage

Add a `bugsnagStream()` to the Bunyan streams already in use. Specifying
the `raw` stream type is optional, but improves efficiency.

```js
import bugsnag from '@bugsnag/js'
import bugsnagStream from 'bunyan-bugsnag'

const bugsnagClient = bugsnag('bugsnag-api-key')

const logger = bunyan.createLogger({
  name: 'appName',
  streams: [
    {
      level: 'info',
      stream: process.stdout,
    },
    {
      type: 'raw',
      level: 'warn',
      stream: bugsnagStream({ bugsnagClient }),
    },
  ],
})
```

## Configuration

In addition to the `bugsnagClient` the stream takes the following
optional options, with these defaults:

```javascript
bugsnagStream({
  bugsnagClient,
  systemInfo: ['name', 'hostname', 'pid', 'req_id', 'level', 'time', 'v'],
  warningLevel: 'warn',
  errorLevel: 'error',
})
```

Use the `warningLevel` and `errorLevel` settings to specify which severity will be
indicated to Bugsnag. For example, to send `log.error()` calls as a `warning` and only
`log.fatal()` calls as errors set `errorLevel: 'fatal'`. Any level below `warningLevel`
will be sent with `info` severity if the Bunyan stream config `level` is set to pass
lower levels in the first place. _Levels can be specified by name or as a number._

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
  },
})
```

This will create `system` and `info` tabs in the Bugsnag report providing this information.

## License

Free to use under the MIT license.

See the [LICENSE file](/LICENSE.md) for license text and copyright information.
