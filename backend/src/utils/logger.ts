<<<<<<< HEAD

=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
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
<<<<<<< HEAD
  
  originalLog(...args);
  
=======
  originalLog(...args);
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  fs.appendFileSync(getLogFileName(), logMessage, 'utf8');
};

console.error = (...args: any[]) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} [ERROR] ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}\n`;
<<<<<<< HEAD
  
  originalError(...args);
  
=======
  originalError(...args);
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  fs.appendFileSync(getLogFileName(), logMessage, 'utf8');
};

console.warn = (...args: any[]) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} [WARN] ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}\n`;
<<<<<<< HEAD
  
  originalWarn(...args);
  
=======
  originalWarn(...args);
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  fs.appendFileSync(getLogFileName(), logMessage, 'utf8');
};

console.info = (...args: any[]) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} [INFO] ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}\n`;
<<<<<<< HEAD
  
  originalInfo(...args);
  
=======
  originalInfo(...args);
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  fs.appendFileSync(getLogFileName(), logMessage, 'utf8');
};

const logger = {
  info: console.info,
  error: console.error,
  warn: console.warn,
  log: console.log
};

<<<<<<< HEAD
export default logger;
=======
export default logger;
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
