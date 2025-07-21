"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const historySchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'User ID is required'],
        ref: 'User',
    },
    gameId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Game ID is required'],
        ref: 'Game',
    },
    generatedNumber: {
        type: Number,
        required: [true, 'Generated number is required'],
    },
    result: {
        type: String,
        enum: ['win', 'lose'],
        required: [true, 'Result is required'],
    },
    newBalance: {
        type: Number,
        required: [true, 'New balance is required'],
    },
    balanceChange: {
        type: Number,
        required: [true, 'Balance change is required'],
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('History', historySchema);
