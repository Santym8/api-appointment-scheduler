export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    rol: string;
    active: boolean;
    createAt: Date
    lastConnection: Date;
}