import { Router } from "express";
import register from "@/controllers/v1/auth/register";
import { body } from "express-validator";
import User from "@/models/user";

const router = Router();

router.post(
    '/register',
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format').custom(async (value) => {
        const existingUser = await User.exists({ email: value });
        if (existingUser) {
            throw new Error('Email already in use');
        }
        return true;
    }),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').notEmpty().withMessage('Password is required'),
    body('role').optional().isIn(['user', 'admin']).isString().withMessage('Role must be either user or admin'),
    register
);

export default router;