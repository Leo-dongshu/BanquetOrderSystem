

import fs from 'fs';
import path from 'path';

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const getLogFileName = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return path.join(logDir, `${year}-${month}-${day}.log`);
};

const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;
const originalInfo = console.info;

console.log = (...args: any[]) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} [LOG] ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}\n`;

  originalLog(...args);

  fs.appendFileSync(getLogFileName(), logMessage, 'utf8');
};

console.error = (...args: any[]) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} [ERROR] ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}\n`;

  originalError(...args);

  fs.appendFileSync(getLogFileName(), logMessage, 'utf8');
};

console.warn = (...args: any[]) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} [WARN] ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}\n`;

  originalWarn(...args);

  fs.appendFileSync(getLogFileName(), logMessage, 'utf8');
};

console.info = (...args: any[]) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} [INFO] ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}\n`;

  originalInfo(...args);

  fs.appendFileSync(getLogFileName(), logMessage, 'utf8');
};

const logger = {
  info: console.info,
  error: console.error,
  warn: console.warn,
  log: console.log
};


export default logger;

