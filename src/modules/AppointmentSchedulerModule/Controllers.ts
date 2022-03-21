import { Request, Response } from "express";
import { ShiftModel } from "./Models ";
import jwt from 'jsonwebtoken';
import { IShift } from "./Interfaces/IShift";

export class Controllers {

    private static getIdToken(req: Request) {
        const token = req.headers['x-access-token']?.toString();
        if (token) {
            return jwt.verify(token, process.env.KEYWORD || '');
        }
        return null
    }

    public static async createShift(req: Request, res: Response): Promise<void> {
        const { startDate } = req.body;
        const doctorId = Controllers.getIdToken(req);
        const shiftsOnTheDate = await ShiftModel.findOne({ startDate, doctorId });

        if (shiftsOnTheDate) {
            res.json({ errors: 'the shift on the date ' + startDate + ' already exists' });
        } else {
            const newShift = new ShiftModel({ doctorId, startDate });
            newShift.save()
                .then(() => {
                    res.json({ msg: 'shift created succesfully' });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ errors: 'Error' });
                })
        }
    }

    public static async deleteShift(req: Request, res: Response): Promise<void> {
        const { shiftId } = req.body;
        const doctorId = Controllers.getIdToken(req);

        const shift = await ShiftModel.findOne({ doctorId, _id: shiftId });

        if (shift) {
            shift.delete();
            res.json({ msg: 'deletion successful' });
        } else {
            res.json({ errors: 'the shift does not exists' });
        }
    }
}