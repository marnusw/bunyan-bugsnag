import { Writable } from 'stream'

const levelFromName = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
}

function bugsnagLogStream(options) {
  const {
    bugsnagClient,
    systemInfo = ['name', 'hostname', 'pid', 'req_id', 'level', 'time', 'v'],
  } = options

  const warningLevel = normalizeLevel(options.warningLevel || 40)
  const errorLevel = normalizeLevel(options.errorLevel || 50)

  return new Writable({
    objectMode: true,
    write(data) {
      if (typeof data === 'string') {
        data = JSON.parse(data)
      }

      const error = data.err || data.error || new Error(data.msg)

      const { system, info } = splitSystemAndInfo(data)

      bugsnagClient.notify(error, (event) => {
        event.severity = selectSeverity(data.level)
        event.addMetadata('system', system)
        event.addMetadata('info', info)
      })

      return true
    },
  })

  function normalizeLevel(level) {
    return typeof level === 'string' ? levelFromName[level] : level
  }

  function selectSeverity(level) {
    if (level >= errorLevel) {
      return 'error'
    }
    if (level >= warningLevel) {
      return 'warning'
    }
    return 'info'
  }

  function splitSystemAndInfo(data) {
    const info = Object.assign({}, data)
    delete info.error
    delete info.err

    const system = {}

    for (let i = 0; i < systemInfo.length; ++i) {
      system[systemInfo[i]] = info[systemInfo[i]]
      delete info[systemInfo[i]]
    }

    return { system, info }
  }
}

export default bugsnagLogStream
