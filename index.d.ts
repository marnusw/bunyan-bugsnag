import Bugsnag from '@bugsnag/node'
import { Writable } from 'stream'

export interface Options {
  bugsnagClient: typeof Bugsnag,
  systemInfo?: string[],
  warningLevel?: number | string,
  errorLevel?: number | string,
}

declare function bugsnagString(options: Options): Writable;

export default bugsnagString
