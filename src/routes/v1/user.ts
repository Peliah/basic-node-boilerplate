import { Router } from "express";
import { param, query, body } from "express-validator";
import User from "@/models/user";

import authenticate from "@/middleware/authenticate";
import validationError from "@/middleware/validationError";
import authorize from "@/middleware/authorize";
import getCurrentUser from "@/controllers/v1/user/get_current_user";
import updateCurrentUser from "@/controllers/v1/user/update_current_user";

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
    updateCurrentUser,
);

export default router;