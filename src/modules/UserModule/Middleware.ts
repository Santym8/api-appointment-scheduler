import { Request, Response } from "express";
import { body, validationResult } from 'express-validator';
import { UserModel } from "./Models";
export default class Middlewares {

    static validateSingUp = [
        body('email').notEmpty().isEmail(),
        body('firstName').notEmpty().isLength({ min: 4, max: 20 }),
        body('lastName').notEmpty().isLength({ min: 4, max: 20 }),
        body('password').notEmpty().isLength({ min: 8, max: 15 }),

        (req: Request, res: Response, next: any) => {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(422).json({ errors: errors.array() });
            next();
        }
    ];

    static validateLogIn = [
        body('email').notEmpty().isEmail(),
        body('password').notEmpty().isLength({ min: 8, max: 15 })
    ];

}