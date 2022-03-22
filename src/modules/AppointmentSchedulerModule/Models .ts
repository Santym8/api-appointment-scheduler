import { model, Schema } from 'mongoose';
import { IShift } from './Interfaces/IShift';

const shiftSchema = new Schema({
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    complete: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

export const ShiftModel = model<IShift>('Shift', shiftSchema);