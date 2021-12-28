const newrelicFormatter = require('@newrelic/winston-enricher');
const { GlobalTransport } = require('../transports');
const {
    createLogger,
    format,
    format: { combine },
    transports
} = require('winston');

module.exports = (config) => {
    let level = config.logLevel;
    let winstonTransports = [];

    const commonConfig = {
        level,
        handleExceptions: true,
        format: combine(
            format.label({ label: 'test' }),
            newrelicFormatter()
        )
    };
    winstonTransports.push(
        new transports.Console({
            ...commonConfig,
            silent: process.env.NODE_ENV === 'test'
        })
    );

    if (process.env.NODE_ENV === 'test') {
        winstonTransports.push(new GlobalTransport(commonConfig));
    }

    return createLogger({
        level: config.logLevel,
        transports: winstonTransports,
        exitOnError: false
    });
};
