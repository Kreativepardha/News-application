import winston, { format } from 'winston';
import { red, yellow, blue, green, bgBlue, bgCyanBright, bgMagentaBright, bgMagenta, bgRed, bgYellow, bgBlack, bgWhite } from 'colorette';

const { combine, timestamp, label, printf } = format;

// Function to colorize the log level
const colorizeLevel = (level: string) => {
  switch (level.toUpperCase()) {
    case 'ERROR':
      return bgRed(level);
    case 'WARN':
      return yellow(level);
    case 'INFO':
      return blue(level);
    default:
      return bgBlue(level);
  }
};

const myFormat = printf(({ level, message, label, timestamp }) => {
  const customLevel = colorizeLevel(level.toUpperCase()); 
  const customTimestamp = blue(timestamp as string); 
  const customMessage = bgBlue(message); 

  return `${customTimestamp} [${label}] ${customLevel}: ${customMessage}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    label({ label: 'right noooow !!' }), 
    timestamp(), 
    myFormat 
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console(), 
    new winston.transports.File({ filename: 'error.log', level: 'error' }), 
    new winston.transports.File({ filename: 'logs.log' }) 
  ],
});

// Use logger to log messages
// logger.info('This is an info message');
// logger.error('This is an error message');
// logger.warn('This is a warning message');

export default logger;
