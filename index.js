'use strict'

const Stream = require('stream')
let bugsnag = require('bugsnag')

const levelFromName = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
}


function bugsnagLogStream(options) {
  options = normalizeLevels(options, {
    systemInfo: ['name', 'hostname', 'pid', 'req_id', 'level', 'time', 'v'],
    warningLevel: 40,
    errorLevel: 50,
  })

  bugsnag = selectBugsnag(options)

  return new Stream.Writable({
    objectMode: true,
    write(data) {
      if (typeof data === 'string') {
        data = JSON.parse(data)
      }

      const error = data.err || data.error || new Error(data.msg)

      const optionsMap = splitSystemAndInfo(data)
      optionsMap.severity = selectSeverity(data.level)

      bugsnag.notify(error, optionsMap)

      return true
    },
  })

  function selectBugsnag(opts) {
    if (opts.bugsnag) {
      return opts.bugsnag
    }
    return bugsnag
  }

  function normalizeLevels(opts, defaults) {
    opts = Object.assign(defaults, opts)
    if (typeof opts.warningLevel === 'string') {
      opts.warningLevel = levelFromName[opts.warningLevel]
    }
    if (typeof opts.errorLevel === 'string') {
      opts.errorLevel = levelFromName[opts.errorLevel]
    }
    return opts
  }

  function selectSeverity(level) {
    if (level >= options.errorLevel) {
      return 'error'
    }
    if (level >= options.warningLevel) {
      return 'warning'
    }
    return 'info'
  }

  function splitSystemAndInfo(data) {
    const info = Object.assign({}, data)
    delete info.error
    delete info.err

    const systemInfo = options.systemInfo
    const system = {}

    for (let i = 0; i < systemInfo.length; ++i) {
      system[systemInfo[i]] = info[systemInfo[i]]
      delete info[systemInfo[i]]
    }

    return {system, info}
  }
}

module.exports = bugsnagLogStream
