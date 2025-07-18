import { Router } from "express";
import authRoutes from './auth';
import userRoutes from './user';
import gameRoutes from './game';
import historyRoutes from './history';

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the demo Node.js project!',
        status: 'OK',
        version: '1.0.0',
        docs: "",
        timestamp: new Date().toISOString(),

    });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/games', gameRoutes);
router.use('/history', historyRoutes)

export default router;