import express from 'express';

import {
    getTrainings,
    createTraining
} from '../controllers/trainingControllers.js';

const router = express.Router();

router.get('/trainings', getTrainings);
router.post('/trainings', createTraining);

export default router;