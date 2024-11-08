import express from 'express';

import {
    getPosts,
    getPostBySlug,
    createPost,
} from '../controllers/postControllers.js';
import { verifyToken } from '../controllers/authControllers.js';

const router = express.Router();

router.get('/posts', getPosts);
router.get('/posts/:slug', getPostBySlug);
router.post('/posts', verifyToken, createPost);

export default router;