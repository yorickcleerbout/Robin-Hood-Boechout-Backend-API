import express from 'express';

import {
    signIn,
    createUser
} from '../controllers/authControllers.js';

const router = express.Router();

router.post('/auth/login', signIn);
router.post('/auth/register', createUser);

export default router;