// import winston from 'winston';

// const logFormat = winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.printf(({ timestamp, level, message }) => {
//         return `${timestamp} [${level}]: ${message}`;
//     })
// );

// const logger = winston.createLogger({
//     level: 'info',
//     format: logFormat,
//     transports: [
//         new winston.transports.File({
//             filename: 'logs/system.log',
//             level: 'info',
//         }),
//         new winston.transports.Console({
//             format: winston.format.simple(),
//         }),
//     ],
// });

// export default logger;


import winston from 'winston';

const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // JSON ফরম্যাটে লগ ফর্ম্যাট করা
);

const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new winston.transports.File({
            filename: 'logs/system.log',
            level: 'info',
        }),
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

export default logger;
