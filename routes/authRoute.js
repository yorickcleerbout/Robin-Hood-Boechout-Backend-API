import express from 'express';

import {
    signIn,
    createUser,
    requestAccess
} from '../controllers/authControllers.js';

const router = express.Router();

router.post('/auth/login', signIn);
router.post('/auth/register', createUser);
router.post('/auth/request', requestAccess);

export default router;