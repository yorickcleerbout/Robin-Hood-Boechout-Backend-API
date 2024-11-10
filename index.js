import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from './config.js';

const app = express();

app.use(cors({ origin: ['https://api.robinhoodboechout.be', 'https://robinhoodboechout.be', 'http://localhost:3000'], credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// IMPORT ROUTES
import postRoute from './routes/postRoute.js';
import trainingRoute from './routes/trainingRoute.js';
import eventRoute from './routes/eventRoute.js';
import subscriberRoute from './routes/subscriberRoute.js';
import authRoute from './routes/authRoute.js';
import rootRoute from './routes/rootRoute.js';

// ROUTES
app.use('/api/v1', postRoute);
app.use('/api/v1', trainingRoute);
app.use('/api/v1', eventRoute);
app.use('/api/v1', subscriberRoute);
app.use('/api/v1', authRoute);
app.use('/', rootRoute);

// API SERVER STARTUP
app.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`),
);

export default app;