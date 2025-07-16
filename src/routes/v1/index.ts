import { Router } from "express";
import authRoutes from './auth';

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

export default router;