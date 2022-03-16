import { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';
import { IUser } from './Interfaces/IUser';
const userSchema = new Schema({
    firstName: {
        type: String,
        uppercase: true,
        required: true
    },
    lastName: {
        type: String,
        uppercase: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    },
    createAt: {
        type: Date,
        default: new Date(Date.now())
    },
    lastConnection: {
        type: Date,
        default: new Date(Date.now())
    }

}, {
    versionKey: false
}

);

userSchema.pre('save', async function (next) {
    const user = this;

    //If the password is not being changed, it should not be re-encrypted
    if (!user.isModified('password')) return next();

    //If the password is being changed, it should be re-encrypted
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
    } catch (error) {
        console.log(error);
    }
    return next();
});

export const UserModel = model<IUser>('User', userSchema);