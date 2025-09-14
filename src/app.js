import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from '#routes/auth.routes.js';
import userRoutes from '#routes/user.routes.js'
import logger from '#config/logger.js';
import securityMiddleware from "#middleware/security.middleware.js";

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  morgan('combined', {
    stream: {
      write: message => logger.info(message.trim()),
    },
  })
);
app.use(securityMiddleware);

app.get('/', (req, res) => {
  logger.info('Hello from acquisition');
  res.status(200).send('Hello from Acquisitions API');
});
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes)

app.use((req,res) => {
    res.status(404).json({
        error: 'Not Found',
    });
})
export default app;
