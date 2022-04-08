import {transports, format} from 'winston'
const { createLogger } = require('winston');
const { combine, timestamp, colorize, printf, ms } = format;

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};
const logFormat = printf(options => options.timestamp +' '+ options.level.toUpperCase() +' '+ (options.message ? JSON.stringify(options.message, undefined, 2) : '')
    + ' ' + options.ms + (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' )
)

export const logger = createLogger({
    level: logLevels.info,
    format: combine(
        timestamp(),
        ms(),
        logFormat
    ),
    transports: [
        new transports.Console({ level: 'info', format: colorize({all:true}) }),
        new transports.File({ filename: ("logs/eventLogger"), level: 'debug' }),
    ]
});
