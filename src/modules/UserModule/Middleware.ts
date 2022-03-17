import { Request, Response } from "express";
import { body, validationResult, query } from 'express-validator';
import { UserModel } from "./Models";
import jwt from 'jsonwebtoken';

export default class Middlewares {

    //-------------------Validate fields----------------------

    private static validateErrors = (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    }

    static validateFieldsSingUp = [
        body('email').notEmpty().isEmail(),
        body('firstName').notEmpty().isLength({ min: 4, max: 20 }),
        body('lastName').notEmpty().isLength({ min: 4, max: 20 }),
        body('password').notEmpty().isLength({ min: 8, max: 15 }),
        Middlewares.validateErrors
    ];

    static validateFieldsLogIn = [
        query('email').notEmpty().isEmail(),
        query('password').notEmpty().isLength({ min: 8, max: 15 }),
        Middlewares.validateErrors
    ];

    static validateFieldsRename = [
        body('firstName').notEmpty().isLength({ min: 4, max: 20 }),
        body('lastName').notEmpty().isLength({ min: 4, max: 20 }),
        Middlewares.validateErrors
    ];

    static validateFieldsChangePassword = [
        body('password').notEmpty().isLength({ min: 8, max: 15 }),
        body('newPassword').notEmpty().isLength({ min: 8, max: 15 }),
        Middlewares.validateErrors
    ];

    static validateFieldsChangeEmail = [
        body('newEmail').notEmpty().isEmail(),
        Middlewares.validateErrors
    ];
    //--------------------Validate token-----------------
    static isUserToken = async (req: Request, res: Response, next: any) => {
        try {
            const token = req.headers['x-access-token']?.toString();
            if (!token) return res.json({ message: 'No token' });
            const id = jwt.verify(token, process.env.KEYWORD || '');
            const user = UserModel.findById(id);
            if (!user) return res.json({ message: 'User dose not exist' });
            next();

        } catch (error) {
            console.log(error);
            return res.json({ message: 'Unuthorized' });
        }
    }

    static isAdminToken = async (req: Request, res: Response, next: any) => {
        try {
            const token = req.headers['x-access-token']?.toString();
            if (!token) return res.json({ message: 'No token' });
            const id = jwt.verify(token, process.env.KEYWORD || '');
            const user = await UserModel.findById(id);
            if (!user || user.rol != 'a') return res.json({ message: 'tehe admin user dose not exist' });
            next();

        } catch (error) {
            return res.json({ message: 'Unuthorized' });
        }
    }

}