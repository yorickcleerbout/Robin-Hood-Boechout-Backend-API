import express from 'express';
import cors from 'cors';
import config from './config.js';

const app = express();

app.use(cors());
app.use(express.json());

// IMPORT ROUTES
import postRoute from './routes/postRoute.js';
import trainingRoute from './routes/trainingRoute.js';
import eventRoute from './routes/eventRoute.js';
import subscriberRoute from './routes/subscriberRoute.js';

// ROUTES
app.use('/api/v1', postRoute);
app.use('/api/v1', trainingRoute);
app.use('/api/v1', eventRoute);
app.use('/api/v1', subscriberRoute);

// API SERVER STARTUP
app.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`),
);
