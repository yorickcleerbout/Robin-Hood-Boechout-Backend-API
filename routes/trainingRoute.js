import express from 'express';

import {
    getTrainings,
    createTraining
} from '../controllers/trainingControllers.js';
import { verifyToken } from '../controllers/authControllers.js';

const router = express.Router();

router.get('/trainings', getTrainings);
router.post('/trainings', verifyToken, createTraining);

export default router;