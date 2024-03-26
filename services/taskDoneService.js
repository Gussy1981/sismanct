const Tasktodo = require("../models/tasktodo");

const equiposToFind = async(equipoIdentity) => {

    let equiposFinded = await Tasktodo.find({"equipo": equipoIdentity})
                                             .select({"_id": 1, "tarea": 0, "equipo": 0, "encargado": 0})
                                             .exec();
                                            
    return{
        equiposFinded
    }                                        
}

const userToFind = async(userIdentity) => {

    let userFinded = await Tasktodo.find({"encargado": userIdentity})
                                             .select({"_id": 1, "tarea": 0, "equipo": 0, "encargado": 0})
                                             .exec()
                                        
                                            
    return{
        userFinded
    }                                        
}

module.exports =  {
    equiposToFind,
    userToFind
}

