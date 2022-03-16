export interface IUser {
    id:string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    rol: string;
    active: boolean;
    createAt: Date
    lastConnection: Date;
}