const { createLogger, format, transports, config } = require('winston');
const { combine, timestamp, json } = format;

const options = {
    file: {
        level: 'debug',
        filename: 'logs/mcdb.log',
        handlleExceptions: true,
        json: true,
        maxise: 5243880,
        maxFiles: 5,
        format: combine(
            timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            json()
        ),
    },
    console: {
        level: 'debug',
        handlleExceptions: true,
        json: true,
        colorize: true,
    },
};

const logger = createLogger({
    levels: config.npm.levels,
    transports: [
        new transports.File(options.file),
        new transports.Console(options.console),
    ],
    exitOnError: false,
});

module.exports = logger;
