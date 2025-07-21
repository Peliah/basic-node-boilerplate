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
const game_play_1 = __importDefault(require("../../controllers/v1/game/game_play"));
const router = (0, express_1.Router)();
router.post('/play', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), (0, express_validator_1.body)('userId').notEmpty().isString().withMessage('User ID must be a string'), (0, express_validator_1.body)('generatedNumber').notEmpty().isInt().withMessage(''), (0, express_validator_1.body)('newBalance').notEmpty().isInt().withMessage('New balance must be a number'), (0, express_validator_1.body)('result').notEmpty().isIn(['win', 'lose']).withMessage('Result must be either "win" or "lose"'), validationError_1.default, game_play_1.default);
exports.default = router;
