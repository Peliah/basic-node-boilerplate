import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    firstName?: string;
    lastName?: string;
    phone: string;
    profilePicture?: string;
    bio?: string;
    balance: number;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username must be unique'],
        maxlength: [20, 'Username must be less than 20 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: '{VALUE} is not a valid role'
        },
        default: 'user',
        required: [true, 'Role is required']
    },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    phone: { type: String, required: [true, 'Phone number is required'], unique: true },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    balance: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default model<IUser>('User', userSchema);