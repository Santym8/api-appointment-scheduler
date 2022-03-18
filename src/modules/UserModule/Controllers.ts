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
                res.json({ errors: 'the email is already in use' });
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
            res.json({ errors: 'the user does not exists' });
        }
    }
    public static async changePassword(req: Request, res: Response): Promise<void> {
        const { password, newPassword } = req.body;
        const userId = Controllers.getIdToken(req);
        const user = await UserModel.findById(userId);

        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                user.password = newPassword;
                user.save()
                    .then((() => {
                        res.json({ msg: 'password change successful' });
                    }))
                    .catch((err) => {
                        res.json({ errors: 'errors' });
                        console.log(err);
                    })
            } else {
                res.json({ errors: 'incorrect password' })
            }
        } else {
            res.json({ errors: 'the user does not exists' });
        }
    }
    public static async changeEmail(req: Request, res: Response): Promise<void> {
        const { newEmail } = req.body;
        const userId = Controllers.getIdToken(req);
        const user = await UserModel.findById(userId);
        if (user) {
            if (await UserModel.findOne({ email: newEmail })) {
                res.json({ errors: 'this email is already in use' })
            } else {
                user.email = newEmail;
                user.save()
                    .then(() => {
                        res.json({ msg: 'email change successful' });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.json({ errors: 'incorrect password' });
                    })
            }
        } else {
            res.json({ errors: 'the user does not exists' });
        }
    }
    public static async getUser(req: Request, res: Response): Promise<void> {
        const userId = Controllers.getIdToken(req);
        const user = await UserModel.findById(userId);
        if (user) {
            res.json({
                firstname: user.firstName,
                lastName: user.lastName,
                email: user.email,
                rol:user.rol
            });
        } else {
            res.json({ errors: 'the user does not exists' });
        }
    }

    //---------------------Admin token----------------------

    public static async getAllUsers(req: Request, res: Response) {
        const allUsers = await UserModel.find();
        let allUserSend: any = [];

        for (let i = 0; i < allUsers.length; i++) {
            let user = allUsers[i];
            allUserSend.push(
                {
                    _id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    rol: user.rol,
                    active: user.active,
                    createAt: user.createAt,
                    lastConnection: user.lastConnection
                }
            );
        }
        res.json({ data: allUserSend });
    }

    public static async createDoctor(req: Request, res: Response) {
        const { firstName, lastName, email, password } = req.body;
        const user = await UserModel.findOne({ email: email });

        if (user) {
            //---------------------When the Docotr alredy exists----------------------
            if (!user.active && user.rol == 'd') {
                res.json({ errors: 'The Doctor with the email ' + user.email + ' was deactivated ' });
            } else {
                res.json({ errors: 'the email is already in use' });
            }
        }
        else {
            //--------------------Create a new Doctor-------------------------------
            const newUser = new UserModel({ firstName, lastName, email, password, rol: 'd' });
            newUser.save()
                .then(() => {
                    res.status(200).json({ msg: 'doctor successfully created' });
                })
                .catch((err: Error) => {
                    console.log(err);
                    res.json({ errors: 'Error' });
                })
        }
    }

    public static async enableDisableUser(req: Request, res: Response) {
        const { userId } = req.body;

        const user = await UserModel.findById(userId);

        if (user) {
            user.active = !user.active;
            user.save()
                .then(() => {
                    res.json({ msg: 'change made successfully' });
                })
                .catch((err) => {
                    res.json({ errors: 'Error' });
                    console.log(err);
                })
        } else {
            res.json({ errors: 'the user does not exists' });
        }

    }
}