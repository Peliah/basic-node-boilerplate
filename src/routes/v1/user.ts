import { Router } from "express";
import { param, query, body } from "express-validator";
import User from "@/models/user";

import authenticate from "@/middleware/authenticate";
import validationError from "@/middleware/validationError";
import authorize from "@/middleware/authorize";
import getCurrentUser from "@/controllers/v1/user/get_current_user";
import updateCurrentUser from "@/controllers/v1/user/update_current_user";
import deleteCurrentUser from "@/controllers/v1/user/delete_current_user";
import getAllUsers from "@/controllers/v1/user/get_all_users";
import getUser from "@/controllers/v1/user/get_user_by_id";
import updateUser from "@/controllers/v1/user/update_user_by_id";
import deleteUser from "@/controllers/v1/user/delete_user_by_id";

const router = Router();

// Route to get the current authenticated user's details
router.get('/me',
    authenticate,
    authorize(['user', 'admin']),
    getCurrentUser
);

// route to update the current user's details
router.put('/me',
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

router.delete('/me',
    authenticate,
    authorize(['user', 'admin']),
    deleteCurrentUser
);

// route to get the all users
router.get('/',
    authenticate,
    authorize(['admin']),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be a positive integer'),
    query('offser').optional().isInt({ min: 0 }).withMessage('Page must be a positive integer'),
    validationError,
    getAllUsers
);

// get user by id
router.get('/:id',
    authenticate,
    authorize(['admin']),
    param('id').notEmpty().isMongoId().withMessage('Invalid user ID format'),
    validationError,
    getUser,
);

// route to update user by id
router.put('/:id',
    authenticate,
    authorize(['admin']),
    param('id').notEmpty().isMongoId().withMessage('Invalid user ID format'),
    body('username').optional().isString().isLength({ max: 20 }).withMessage('Username must be a string and less than 20 characters').custom(async (value, { req }) => {
        const userExists = await User.findOne({ username: value, _id: { $ne: req.params!.id } });
        if (userExists) {
            throw new Error('Username is already in use');
        }
    }),
    body('email').optional().isEmail().withMessage('Email must be a valid email address').custom(async (value, { req }) => {
        const userExists = await User.findOne({ email: value, _id: { $ne: req.params!.id } });
        if (userExists) {
            throw new Error('Email already exists');
        }
    }),
    body('password').optional().isString().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
    body(['first_name', 'last_name']).optional().isString().withMessage('Name must be  less than 50 characters').isLength({ max: 50 }),
    body(['twitter', 'facebook', 'linkedin', 'instagram', 'youtube', 'github', 'website']).optional().isURL().withMessage('Social links must be valid URLs'),
    validationError,
    updateUser,
);

// route to delete user by id
router.delete('/:id',
    authenticate,
    authorize(['admin']),
    param('id').notEmpty().isMongoId().withMessage('Invalid user ID format'),
    validationError,
    deleteUser,
);

export default router;