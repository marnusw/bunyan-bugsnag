# Bunyan Bugsnag Stream



Requires Node.js `v4.7.3` or higher.

## Installation

Install via `npm`:

```
npm install --save bunyan-bugsnag
```

## Usage

```javascript
import bugsnagStream from 'bunyan-bugsnag'

const logger = bunyan.createLogger({
  name: 'appName',
  streams: [{
    level: 'info',
    stream: process.stdout,
  },{
    type: 'raw',
    level: 'warn',
    stream: bugsnagStream(),
  }],
})
```

## Contributing

This library is pretty new, any thoughts/PRs are welcome.


## License

This software is free to use under the MIT license.
See the [LICENSE file](/LICENSE.md) for license text and copyright information.
