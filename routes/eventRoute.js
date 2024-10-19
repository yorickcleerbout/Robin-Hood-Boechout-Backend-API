import express from 'express';

import {
    getEvents,
} from '../controllers/eventControllers.js';

const router = express.Router();

router.get('/events/:slug', getEvents);

export default router;