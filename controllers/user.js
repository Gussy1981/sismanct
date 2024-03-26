//importar dependencias y modulos
const User = require("../models/user"); //importo modelo de usuario
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");

//Accion de prueba
const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controller/user.js",
        usuario: req.user
    });
}

//Registro de Usuarios
const register = (req, res) => {
    //Recoger datos de la peticion
    let params = req.body;
    console.log(params)

    //comprobar que los datos requeridos llegan
    if (!params.name || !params.dni) {
        return res.status(400).json({
            status: "Error",
            message: "Faltan datos por enviar"
        });
    }
    //control de usuarios repetidos, chequeo si existe usuario con mismo nombre y apellido en la BBDD
    User.find({
        $and: [
            { name: params.name },
            { dni: params.dni },
        ]
    }).exec(async (error, users) => { // en esta linea aplico el async 
        if (error) return res.status(500).json({
            status: "Error",
            message: "Error en la consulta de Usuarios"
        });
        if (users && users.length >= 1) {
            return res.status(200).send({
                status: "Succes",
                message: "El Usuario ya existe"
            })
        }

        //cifrar la contraseña (Uso los métodos de Bcrypt)
        let hash = await bcrypt.hash(params.dni, 10); // en esta linea aplico el await
        params.dni = hash;
        //crear objeto de usuario
        let user_to_save = new User(params);

        //guardar usuario en la base de datos
        user_to_save.save((error, userStored) => {
            if (error || !userStored) return res.status(500).send({
                status: "error",
                message: "Error al guardar el usuario"
            });

            //devolver resultado
            return res.status(200).json({
                status: "Succes",
                message: "Usuario registrado correctamente",
                user: userStored
            });
        })


    });
}

const login = (req, res) => {
    // Obtener parametros del Body (formulario de ingreso)
    let params = req.body;
    // Compruebo si me llega a traves del body el nombre de usuario y el password
    if (!params.name || !params.dni) {
        return res.status(400).send({
            status: "Error",
            message: "Faltan datos por enviar"
        });
    }

    // buscar en la BBDD si usuario existe 
    User.findOne({ name: params.name })
        //.select({ "password": 0 })
        .exec((error, user) => {
            if (error || !user) return res.status(404).send({
                status: "Error",
                message: "El usuario no existe"
            });

            // Comprobar contraseña
            let pwd = bcrypt.compareSync(params.dni, user.dni) //comparo la pass que me llega por params con la que tengo guardada en el user

            if (!pwd) {
                return res.status(400).send({
                    status: "Error",
                    message: "No te has identificado correctamente"
                });
            }
            // Generar token
            const token = jwt.createToken(user);

            // Devolver datos del usuario

            return res.status(200).send({
                status: "Succes",
                message: "Te has identificado correctamente",
                user: {
                    id: user._id,
                    name: user.name,
                    role: user.role
                },
                token
            });
        });

}
//Metodo para obtener datos del usuario
const profile = (req, res) => {
    //recibir el parametro del id del user por url
    const id = req.params.id;
    //consulta para sacar los datos del user
    User.findById(id)
        .select({ dni: 0 })
        .exec((error, userProfile) => {
            if (error || !userProfile) {
                return res.status(404).send({
                    status: "Error",
                    message: "El usuario no existe o hay un error"
                });
            }
            //devolver resultado
            return res.status(200).send({
                status: "Succes",
                message: "Usuario encontrado",
                user: userProfile
            });

        });

};

//Metodo para listar todos los registros
const listAll = async (req, res, next) => {
    console.log(req.query);
    try {
        let users = await User.find({});
                                 
        res.json({
            status: "Succes",
            message: "Listado Completo correcto",
            users
        })
    } catch (error) {
        res.send({
            status: "Error",
            message:"Error al mostrar registros",
            error
        })
        next(error);
    }
}

//Metodo para modificar registros
const update = async (req, res, next) => {
    try {
        let user = await User.updateOne({ _id: req.params.id }, req.body);
             res.status(200).send({
                status: "Succes",
                message: "Usuario Modificado Correctamente",
                user: user
            });
        
        console.log("Despues de guardar usuario", user);
    } catch (error) {
        res.send({
            status: "Error",
            message:"Error al modificar registro",
            error
        })
        next(error);
    }
};
//Metodo para eliminar registros
const deleteUser = async (req, res, next) => {
    try {
        let user = await User.deleteOne({ _id: req.params.id })
        return res.status(200).send({
            status: "Succes",
            message: "Registro Eliminado",
            user
        });

    } catch (error) {
        res.send({
            status: "Error",
            message:"Error al eliminar registro",
            error
        })
        next(error);
    }

};

module.exports = {
    pruebaUser,
    register,
    login,
    profile,
    listAll,
    update,
    deleteUser,
}