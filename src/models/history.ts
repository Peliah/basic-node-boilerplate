import { Schema, model, Types } from 'mongoose';

export interface IHistory {
    userId: Types.ObjectId;
    gameId: Types.ObjectId;
    guessedNumber: number;
    generatedNumber: number;
    result: 'win' | 'lose';
    newBalance: number;
    balanceChange: number;
    date: Date;
}

const historySchema = new Schema<IHistory>({
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'User ID is required'],
        ref: 'User',
    },
    gameId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Game ID is required'],
        ref: 'Game',
    },
    guessedNumber: {
        type: Number,
        required: [true, 'Guessed number is required'],
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
export default model<IHistory>('History', historySchema);