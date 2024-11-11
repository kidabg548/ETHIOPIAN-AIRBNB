import { Router } from 'express';
const router = Router();

import { initiatePayment, webhookclient } from '../controllers/chapaControllers'
import verifyToken from '../middleware/auth';

// Initiate payment
router.post('/api/pay', initiatePayment);

// Chapa webhook
router.post('/api/webhook', webhookclient);

export default router;
