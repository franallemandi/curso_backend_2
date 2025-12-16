import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectDb(mongodb_url){
    try {
        await mongoose.connect(mongodb_url)
        console.log("Conectado a la Base de Datos de Mongo Atlas");
    } catch (error) {
        {console.error("La conexión no se ha podido realizar.", error)};
        
    }
}