"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authenticate_1 = __importDefault(require("../../middleware/authenticate"));
const authorize_1 = __importDefault(require("../../middleware/authorize"));
const validationError_1 = __importDefault(require("../../middleware/validationError"));
const get_all_history_1 = __importDefault(require("../../controllers/v1/history/get_all_history"));
const get_user_history_1 = __importDefault(require("../../controllers/v1/history/get_user_history"));
const router = (0, express_1.Router)();
router.get('/', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), get_user_history_1.default);
router.get('/all', authenticate_1.default, (0, authorize_1.default)(['admin']), (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be a positive integer'), (0, express_validator_1.query)('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a positive integer'), validationError_1.default, get_all_history_1.default);
exports.default = router;
