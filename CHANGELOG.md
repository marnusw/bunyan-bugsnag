### v3.0.0 (4 April 2019)

**Breaking changes**

- Support the `@bugsnag/js` libraries. It is required to pass `bugsnagClient` as an option.
- Adds typings and ESM build.
- Requires Node.js `6.17.0`.

### v2.0.0 (23 June 2018)

**Breaking changes**

- [UPGRADE] Moved `bugsnag` to peer dependencies so any version can be used. (If you relied on
  this library to install `bugsnag` for you, add it to your project dependencies explicitly now.)

**Other changes**

- [ENHANCEMENT] Allow passing a specific `bugsnag` instance on the options. (#4)
- [ENHANCEMENT] Allow setting the `bugsnagApiKey` on the options for convenience. (#1)

### v1.0.2 (10 April 2017)

- [BUGFIX] Not mutating the payload so subsequent streams get all data. (#3)

### v1.0.1 (22 March 2017)

- [ENHANCEMENT] Support older versions of Node.js by using strict mode. (#2)

### v1.0.0 (18 February 2017)

Initial release.
