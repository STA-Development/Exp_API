import {transports, format, config, log, error} from 'winston'
import * as winston from "winston";
const { createLogger } = require('winston');
const { combine, timestamp, json, colorize, errors, splat, printf, prettyPrint } = format;

const a = function(options) {
    return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (options.message ? options.message : '') +
        (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
}
const myFormatter = winston.format((info) => {
    const {level, message} = info;
    info.level = `${level} with modified label`;
    info.message = `${message} with modified message`;
    return info;
})();

const myFormat = printf( ({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message} `
    if(metadata) {
        msg += JSON.stringify(metadata)
    }
    return msg
});

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};
const logFormat = format.printf(options => options.timestamp +' '+ options.level.toUpperCase() +' '+ (options.message ? JSON.stringify(options.message, undefined, 2) : '')
    + (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' )
)

export const eventLogger = createLogger({
    level: logLevels.info,
    format: combine(
        timestamp(),
        format.simple(),
        logFormat
    ),
    transports: [
        new transports.Console({ level: 'debug', format: colorize({all:true}) }),
        new transports.File({ filename: ("logs/eventLogger"), level: 'debug' }),
    ]
});

















// export const eventLogger = winston.createLogger({
//     level: "info",
//     levels: logLevels,
//     format: format.combine(
//         format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//         // Format the metadata object
//         format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
//     ),
//     transports: [
//         new transports.Console({
//             format: format.combine(
//                 format.colorize(),
//                 format.timestamp(),
//                 logFormat
//             )
//         }),
//         new transports.File({
//             filename: 'logs/combined.log',
//             format: format.combine(
//                 format.timestamp(),
//
//                 // Render in one line in your log file.
//                 // If you use prettyPrint() here it will be really
//                 // difficult to exploit your logs files afterwards.
//                 format.json()
//             )
//         })
//     ],
//     exitOnError: false
// })


//
//
//
// export const userLogger = createLogger({
//     level: logLevels,
//     defaultMeta: { component: 'user' },
//     format: combine(
//         timestamp({
//             format: 'YYYY-MM-DD HH:mm:ss'
//         }),
//         format.printf(
//             info => `${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
//         ),
//         prettyPrint(),
//         colorize({all: true}),
//         errors({ stack: true }),
//         splat(),
//         json()
//     ),
//     transports: [
//         new transports.Console(),
//         new transports.File({ filename: 'userCombined.log' })
//     ],
// });
//
// export const even = createLogger({
//     levels: logLevels,
//     //  level: "info",
//     // levels: {
//     //     'info': 0,
//     //     'ok': 1,
//     //     'error': 2
//     // },
//     defaultMeta: { component: 'event' },
//     format: combine(
//         timestamp({
//             format: 'YYYY-MM-DD HH:mm:ss'
//         }),
//         // format.printf(
//         //     info => `${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
//         // ),
//        // prettyPrint({colorize: true}),
//      //   colorize({all: true}),
//         errors({ stack: true }),
//         splat(),
//         json()
//     ),
//     transports: [
//         new transports.Console(),
//     //    new transports.File({ filename: 'userCombined.log' })
//     ],
// })





// export const eventLogger = createLogger({
//     levels: "info",
//     // levels: {
//     //     'info': 0,
//     //     'ok': 1,
//     //     'error': 2
//     // },
//     defaultMeta: { component: 'event' },
//     format: combine(
//         colorize(),
//         timestamp({
//             format: 'YYYY-MM-DD HH:mm:ss'
//         }),
//         format.printf(
//             info => `${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
//         ),
//         errors({ stack: true }),
//         splat(),
//         json()
//     ),
//     transports: [
//         new transports.Console(),
//         new transports.File({ filename: 'eventCombined.log' })
//     ]
// });
// transports.Console.level = 'info';
// eventLogger.info('Text Info');
// eventLogger.warn('Text Warn');
// eventLogger.error('Text error');
// eventLogger.debug('Text Debug 1');
// export function createLogger (): LoggerService {
//
//     const winstonOptions : WinstonModuleOptions = {
//         level: 'info',
//         format: winston.format.printf(info => `${info.message}`),
//         transports: [
//             new transports.Console(
//                 {
//                 format: format.combine(
//                     format.timestamp(),
//                     utilities.format.nestLike(),
//
//                 ),
//
//                 level: 'debug'
//             }
//             ),
//             new transports.File({
//                 format: format.combine(
//                     format.timestamp(),
//                     utilities.format.nestLike(),
//                 ),
//                 filename: 'errors.log',
//                 level: 'error',
//                 maxsize: 500,
//             }),
//             new transports.File({
//                 format: format.combine(
//                     format.timestamp(),
//                     utilities.format.nestLike(),
//                   format.cli({ colors: {info: "blue"}})
//                 ),
//                 filename: 'warnings.log',
//                 level: 'warning'
//             }),
//         ]
//     }
//     return WinstonModule.createLogger(winstonOptions)
// }
