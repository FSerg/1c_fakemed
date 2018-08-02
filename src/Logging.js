import bunyan from 'bunyan';
import config from './config/config';

const log = bunyan.createLogger({
  name: '1c_fakemed',
  stream: process.stdout,
  level: config.logLevel
});

export default log;
