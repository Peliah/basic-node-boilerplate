"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const gameSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'User ID is required'],
        ref: 'User',
    },
    generatedNumber: {
        type: Number,
        required: [true, 'Guessed number is required'],
    },
    newBalance: {
        type: Number,
        required: [true, 'New balance is required'],
    },
    result: {
        type: String,
        enum: {
            values: ['win', 'lose'],
            message: '{VALUE} is not a valid result',
        },
        required: [true, 'Result is required'],
    }
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Game', gameSchema);
