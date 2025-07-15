import express from 'express';
import config from '@/config';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import limiter from '@/lib/express_rate_limit';
import v1routes from '@/routes/v1/index';

const app = express();

// Middleware setup
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Cors Error: Origin ${origin} not allowed by CORS`), false);
      console.log(`Cors Error: Origin ${origin} not allowed by CORS`);

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

    app.use('/api/v1', v1routes);

    app.listen(config.PORT, () => {
      console.log(`Server running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error('Error during application initialization:', error);
    if (config.NODE_ENV === 'produciton') {
      process.exit(1);
    }
  }
})();

