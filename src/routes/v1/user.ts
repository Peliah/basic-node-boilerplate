import { Router } from "express";
import { param, query, body } from "express-validator";
import User from "@/models/user";

import authenticate from "@/middleware/authenticate";
import validationError from "@/middleware/validationError";
import authorize from "@/middleware/authorize";
import getCurrentUser from "@/controllers/v1/user/get_current_user";
import updateCurrentUser from "@/controllers/v1/user/update_current_user";
import deleteCurrentUser from "@/controllers/v1/user/delete_current_user";

const router = Router();

// Route to get the current authenticated user's details
router.get('/current',
    authenticate,
    authorize(['user', 'admin']),
    getCurrentUser
);

// route to update the current user's details
router.put('/current',
    authenticate,
    authorize(['user', 'admin']),
    body('username').optional().isString().isLength({ max: 20 }).withMessage('Username must be a string and less than 20 characters').custom(async (value) => {
        const userExists = await User.findOne({ username: value });
        if (userExists) {
            throw new Error('Username is already in use');
        }
    }),
    body('email').optional().isEmail().withMessage('Email must be a valid email address').custom(async (value) => {
        const userExists = await User.findOne({ email: value });
        if (userExists) {
            throw new Error('Email already exists');
        }
    }),
    body('password').optional().isString().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body(['first_name', 'last_name']).optional().isString().withMessage('Name must be  less than 50 characters').isLength({ max: 50 }),
    body(['twitter', 'facebook', 'linkedin', 'instagram', 'youtube', 'github', 'website']).optional().isURL().withMessage('Social links must be valid URLs'),
    validationError,
    updateCurrentUser,
);

router.delete('/current',
    authenticate,
    authorize(['user', 'admin']),
    deleteCurrentUser
);
export default router;