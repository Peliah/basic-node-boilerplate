import { Schema, model, Types } from 'mongoose';

export interface IGame {
    userId: Types.ObjectId;
    generatedNumber: number;
    newBalance: number;
    result: 'win' | 'lose';
}

const gameSchema = new Schema<IGame>({
    userId: {
        type: Schema.Types.ObjectId,
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
})

export default model<IGame>('Game', gameSchema);