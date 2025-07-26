import { Schema, model, Types, Document } from 'mongoose';

// export interface IGame {
//     userId: Types.ObjectId;
//     generatedNumber: number;
//     newBalance: number;
//     result: 'win' | 'lose';
// }
//
// const gameSchema = new Schema<IGame>({
//     userId: {
//         type: Schema.Types.ObjectId,
//         required: [true, 'User ID is required'],
//         ref: 'User',
//     },
//     generatedNumber: {
//         type: Number,
//         required: [true, 'Guessed number is required'],
//     },
//     newBalance: {
//         type: Number,
//         required: [true, 'New balance is required'],
//     },
//     result: {
//         type: String,
//         enum: {
//             values: ['win', 'lose'],
//             message: '{VALUE} is not a valid result',
//         },
//         required: [true, 'Result is required'],
//     }
// }, {
//     timestamps: true
// })
//
// export default model<IGame>('Game', gameSchema);

export enum GameStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    FINISHED = 'finished'
}

export interface IGame extends Document {
    creator: Types.ObjectId;      // player 1
    joiner?: Types.ObjectId | null; // player 2
    bet: number;
    timeout: number;               // seconds (duration to wait for join)
    status: GameStatus;
    turn: 1 | 2;
    creatorNumber?: number;
    joinerNumber?: number;
    winner?: Types.ObjectId | null;
    createdAt: Date;
}

const gameSchema = new Schema<IGame>({
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    joiner: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    bet: { type: Number, required: true },
    timeout: { type: Number, required: true },
    status: { type: String, enum: GameStatus, default: GameStatus.PENDING },
    turn: { type: Number, enum: [1, 2], default: 1 },
    creatorNumber: { type: Number },
    joinerNumber: { type: Number },
    winner: { type: Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

export default model<IGame>('Game', gameSchema);