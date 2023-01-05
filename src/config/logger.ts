import winston from 'winston';

const { combine, timestamp, printf } = winston.format;

const formatter = printf(({ level, message, label, timestamp, ...rest }) => {
  return `${timestamp} ${level}: ${label ? `[${label}] ` : ''}${message} ${
    Object.keys(rest).length ? JSON.stringify(rest, undefined, 2) : ''
  }`;
});

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 5,
};

const colors: Record<keyof typeof levels, string> = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'white',
};

winston.addColors(colors);

const logger = winston.createLogger({
  levels,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: combine(winston.format.colorize(), timestamp(), formatter),
    }),
  ],
});

export default logger;
