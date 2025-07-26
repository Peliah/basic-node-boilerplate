import { Router } from "express";
import gameRoutes from './game';

const router = Router();

router.use('/games', gameRoutes);

export default router;