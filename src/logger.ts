import {transports, format, createLogger} from 'winston'

const {combine, timestamp, colorize, printf, ms} = format

const logFormat = printf(
  (options) =>
    `${options.timestamp} ${options.level.toUpperCase()} ${
      options.message ? JSON.stringify(options.message, undefined, 2) : ''
    } ${options.ms}${
      options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : ''
    }`,
)

export const logger = createLogger({
  format: combine(timestamp(), ms(), logFormat),
  transports: [
    new transports.Console({level: 'info', format: colorize({all: true})}),
    new transports.File({filename: 'logs/eventLogger', level: 'debug'}),
  ],
})
