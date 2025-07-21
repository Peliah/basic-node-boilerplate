"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("../../../lib/winston");
const history_1 = __importDefault(require("../../../models/history"));
const createHistory = async (history) => {
    try {
        const newHistory = await history_1.default.create(history);
        winston_1.logger.info('History created successfully', { newHistory });
    }
    catch (error) {
        winston_1.logger.error(`Error creating history: ${error}`);
    }
};
exports.default = createHistory;
