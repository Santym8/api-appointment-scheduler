import mongoose from "mongoose";
export class DataBase {

    public static configDataBase() {
        //Config your DB here 
        mongoose.connect(process.env.MONGODB_URL || '',
            (err) => {
                if (err) return console.log(err);
                return console.log('Data Base Connected');
            }
        )
    }
}
