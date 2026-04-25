import app from './app';
import logger from './utils/logger';

const PORT = process.env.PORT || 8082;

app.listen(PORT, () => {
  logger.info(`服务器运行在 http://localhost:${PORT}`);
});