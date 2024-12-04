import express from 'express';
import { generateSignature } from '../controllers/sign-upload.js';

const router = express.Router();

// http://localhost:4000api/sign-video
router.post('/', generateSignature);

export default router;