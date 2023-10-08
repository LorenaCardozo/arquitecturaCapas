import winston from "winston";

const customLevelsOptions = {
    levels: {
        debug: 5,
        http: 4,
        info: 3,
        warning: 2,
        error: 1,
        fatal: 0,
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        debug: 'white',
        http: 'green' 
    }
}

const developmentLogger = winston.createLogger({
    levels: customLevelsOptions.levels, 
    transports: [
        new winston.transports.Console({
            level: 'debug', // Solo registra niveles desde "debug" en adelante
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors}), 
                winston.format.simple()
            ),            
        }),
    ],
});

const productionLogger = winston.createLogger({
    levels: customLevelsOptions.levels, 
    transports: [
        new winston.transports.File({
            filename: "logs/error.log",
            level: 'info', // Solo registra niveles desde "info" en adelante
            format: winston.format.json(),
        }),
    ],
});

export const addLogger = (req, res, next) => {
    //req.logger = logger;

    if (process.env.NODE_ENV === "production") {
        req.logger = productionLogger;
    } else {
        req.logger = developmentLogger;
    }

    req.logger.debug("entorno:" + process.env.NODE_ENV)

    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`)
    next();
}