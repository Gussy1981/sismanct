// importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

//clave secreta
const secretKey = "secret_key_mantenimiento_sis_1981";

// crear funcion para generar token
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        dni: user.dni,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix() 
    };
    // devolver jwt token codificado
    return jwt.encode(payload, secretKey);
}
module.exports = {
    secretKey,
    createToken
}
