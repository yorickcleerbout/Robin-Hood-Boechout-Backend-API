import express from 'express';

import {
    createSubscriber,
} from '../controllers/subscriberControllers.js';

const router = express.Router();

router.post('/newsletter/subscribe', createSubscriber);

export default router;