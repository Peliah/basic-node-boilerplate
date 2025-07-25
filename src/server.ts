import express from 'express';
import config from '@/config';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import limiter from '@/lib/express_rate_limit';
import v1routes from '@/routes/v1/index';
import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose';
import { logger } from '@/lib/winston';
import swagger from './config/swagger';
import swaggerUI from 'swagger-ui-express';


const app = express();

// Middleware setup
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Cors Error: Origin ${origin} not allowed by CORS`), false);
      logger.error(`Cors Error: Origin ${origin} not allowed by CORS`);

    }
  },
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression({
  level: 6, // Compression level (0-9)
  threshold: 1024, // Compress responses larger than 1KB
}));
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for simplicity, adjust as needed
  crossOriginEmbedderPolicy: false, // Disable COEP for simplicity, adjust as needed
}));
app.use(limiter);


(async () => {
  try {
    await connectToDatabase();
    app.use('/api/v1', v1routes);
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger));

    app.listen(config.PORT, () => {
      logger.info(`Server running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error('Error during application initialization:', error);
    if (config.NODE_ENV === 'produciton') {
      process.exit(1);
    }
  }
})();

const handleShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.warn('Shutting down gracefully...');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
  }
}

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);