const winston = require('winston');
const config = require('config');

const logger = winston.createLogger({
    level: 'silly',
    //format: winston.format.json(),
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        //winston.format.json(),
        winston.format.printf(info => `${info.timestamp} [ ${info.level} ] : ${info.message}`)
    ),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'}),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (config.app.env !== 'live') {
    //logger.add(new winston.transports.Console, {'timestamp':true});
    logger.add(new winston.transports.Console({
        timestamp: true,
        //format: winston.format.simple(),
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            //winston.format.json(),
            winston.format.colorize(),
            winston.format.printf(info => `${info.timestamp} [ ${info.level} ] : ${info.message}`)
        )
    }));
}

logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};

module.exports = logger;
