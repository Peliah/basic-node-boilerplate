import { Router } from "express";
import { body } from "express-validator";
import User from "@/models/user";
import register from "@/controllers/v1/auth/register";
import login from "@/controllers/v1/auth/login";
import bcrypt from 'bcrypt'
import validationError from "@/middleware/validationError";

const router = Router();

// Route to register a new user
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
    validationError,
    register
);

// Route to login a user (not implemented yet)
router.post(
    '/login',
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format').custom(async (value) => {
        const existingUser = await User.exists({ email: value });
        if (!existingUser) {
            throw new Error('User does not exist');
        }
    }),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').custom(async (value, { req }) => {
        const user = await User.findOne({ email: req.body.email }).select('password').lean().exec();
        if (!user) {
            throw new Error('User email or password does not exist');
        }
        const passwordMatch = await bcrypt.compare(value, user.password);
        if (!passwordMatch) {
            throw new Error('User email or password is invalid');
        }
    }),
    validationError,
    login
);



export default router;