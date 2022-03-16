import { Request, Response } from "express";
import { UserModel } from './Models'
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


export default class Controllers {

    private static getIdToken(req: Request) {
        const token = req.headers['x-access-token']?.toString();
        if (token) {
            return jwt.verify(token, process.env.KEYWORD || '');
        }
        return null
    }


    //---------------------------------No token---------------------------------
    public static async singUpPatient(req: Request, res: Response): Promise<void> {
        const { firstName, lastName, email, password } = req.body;

        const user = await UserModel.findOne({ email: email });

        if (user) {
            //---------------------When the user alredy exists----------------------
            if (!user.active) {
                res.json({ errors: 'The user with the email ' + user.email + ' was deactivated ' });
            } else {
                res.json({ errors: 'The user with the email ' + user.email + ' already exists' });
            }
        }
        else {
            //--------------------Create a new User -------------------------------
            const newUser = new UserModel({ firstName, lastName, email, password, rol: 'p' });
            newUser.save()
                .then(() => {
                    const token = jwt.sign({ _id: newUser.id }, process.env.KEYWORD || '', { expiresIn: 3600 });
                    res.status(200).json({ token, rol: newUser.rol });
                })
                .catch((err: Error) => {
                    console.log(err);
                    res.json({ errors: 'Error' });
                })
        }

    }

    public static async logIn(req: Request, res: Response): Promise<void> {
        const { email, password } = req.query;
        const user = await UserModel.findOne({ email });

        if (user && await bcrypt.compare(password as string, user.password)) {
            if (user.active) {
                //lastConnection
                user.lastConnection = new Date(Date.now());
                user.save();
                //token
                const token = jwt.sign({ _id: user.id }, process.env.KEYWORD || '', { expiresIn: 3600 });
                res.status(200).json({ token, rol: user.rol });
            }
            else {
                res.json({ errors: 'The user with the email ' + user.email + ' was deactivated ' });
            }
        } else {
            res.json({ errors: 'Wrong email or password' });
        }
    }

    //-----------------------------User token------------------------

    public static async renameUser(req: Request, res: Response): Promise<void> {
        const { firstName, lastName } = req.body;
        const userId = Controllers.getIdToken(req);
        console.log(userId);
        const user = await UserModel.findById(userId);

        if (user) {
            user.firstName = firstName as string;
            user.lastName = lastName as string;
            user.save()
                .then(() => {
                    res.status(200).json({ msg: 'successfully renamed user' });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ errors: 'could not rename user' });
                })
        } else {
            res.json({ errors: 'the user dose not exists' });
        }




    }


}