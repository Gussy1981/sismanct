require("dotenv").config();
const mongoose = require("mongoose");

const connection = async() => {

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado a la base de datos de mantenimiento");
    } catch (error) {
        console.log(error);
        throw new Error("No se puede conectar a la base de datos");
    }
}
module.exports = {
    connection
}