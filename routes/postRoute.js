import express from 'express';

import {
    getPosts,
    getPostBySlug,
    createPost,
} from '../controllers/postControllers.js';

const router = express.Router();

router.get('/posts', getPosts);
router.get('/posts/:slug', getPostBySlug);
router.post('/posts', createPost);

export default router;