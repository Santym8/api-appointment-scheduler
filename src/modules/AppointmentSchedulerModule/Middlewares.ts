import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { UserModel } from "../UserModule/Models";
import { body, validationResult } from 'express-validator';
export class Middlewares {

    //------------Validate Fields---------
    private static validateErrors = (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    }

    static validateFieldsCreateShift = [
        body('startDate').notEmpty().isISO8601().toDate(),
        Middlewares.validateErrors
    ];

    static validateFieldsShiftId = [
        body('shiftId').notEmpty(),
        Middlewares.validateErrors
    ];

    //-------------Token------------------------
    static isDoctorToken = async (req: Request, res: Response, next: any) => {
        try {
            const token = req.headers['x-access-token']?.toString();
            if (!token) return res.json({ message: 'No token' });
            const id = jwt.verify(token, process.env.KEYWORD || '');
            const user = await UserModel.findById(id);
            if (!user || user.rol != 'd') return res.json({ message: 'the doctor user dose not exist' });
            next();

        } catch (error) {
            return res.json({ message: 'Unuthorized' });
        }
    }
}