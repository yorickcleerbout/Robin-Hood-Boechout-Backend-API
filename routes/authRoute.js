import express from 'express';

import {
    signIn,
    createUser,
    requestAccess,
    verifyToken,
    userInfo
} from '../controllers/authControllers.js';

const router = express.Router();

router.post('/auth/login', signIn);
router.post('/auth/register', verifyToken, createUser);
router.post('/auth/request', requestAccess);
router.get('/auth/verify', userInfo);

export default router;