import { Request, Response } from "express";
import { UserModel } from './Models'
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


export default class Controllers {

    public static async singUpPatient(req: Request, res: Response) {
        const { firstName, lastName, email, password } = req.body;
        //---------------------When the user alredy exists----------------------
        const user = await UserModel.findOne({ email: email });
        if (user) {
            if (!user.active) {
                return res.json({ errors: 'The user with the mail ' + user.email + ' was deactivated ' });
            }
            return res.json({ errors: 'The user with the mail ' + user.email + ' already exists' });
        }

        //--------------------Create a new User -------------------------------
        const newUser = new UserModel({ firstName, lastName, email, password, rol: 'p' });
        newUser.save()
            .then(() => {
                const info = {
                    id: newUser.id,
                    rol: newUser.rol
                }
                const token = jwt.sign(info, 'api-appointment-scheduler', { expiresIn: 3600 });
                return res.status(200).json({ token });
            })
            .catch((err: Error) => {
                console.log(err);
                return res.json({ errors: 'Error' });
            })
    }

    public static async logIn(req: Request, res: Response) {
        const { email, password } = req.query;
        const user = await UserModel.findOne({ email });

        if (user && await bcrypt.compare(password as string, user.password)) {
            //lastConnection
            user.lastConnection = new Date(Date.now());
            user.save();
            //token
            const info = {
                id: user.id,
                rol: user.rol
            }
            const token = jwt.sign(info, 'api-appointment-scheduler', { expiresIn: 3600 });

            return res.status(200).json({ token, rol:user.rol });
        }
        return res.json({ errors: 'Wrong email or password' });
    }


}