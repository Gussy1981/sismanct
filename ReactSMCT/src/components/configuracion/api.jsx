import axios from "axios";
import { Global } from "../../helpers/Global";
import Swal from "sweetalert2";
import { id } from "date-fns/locale";

//Metodo para obtener todas las tareas preventivas iniciadas
export const getTareasPreventivo = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-type": "application/json;",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "tasktodo/listbytarea",
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para obtener todas las tareas preventivas iniciadas
export const getTareas = async () => {
  try {
    const response = await axios.get(Global.url + "tasktodo/listall");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para eliminar los preventivos
export const deleteTareas = async (equipoId) =>{
  console.log("datos recibidos en API", equipoId)
  try{
    const id = equipoId
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.delete(
      Global.url + "tasktodo/delete/" + id,
      {
        headers: headers, 
      }
    );
      console.log("Respuesta de axios.delete", response);
      return response
  } catch (error) {
    console.log(error);
  };

}

//Metodo para modificar preventivo
export const updateTarea = async (equipoId, values) =>{
  console.log("datos recibidos en API", equipoId, values)
  try{
    const id = equipoId
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.put(
      Global.url + "tasktodo/update/" + id,
      values,
      {
        headers: headers, 
      }
    );
      return response.data
  } catch (error) {
    console.log(error);
  };
}

//Metodo para modificar preventivo fechaConsulta
export const updateFechaConsulta = async (equipoId) =>{
  console.log("datos recibidos en API", equipoId)
  try{
    const id = equipoId
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.get(
      Global.url + "tasktodo/updatefechaconsulta/" + id,
      {
        headers: headers, 
      }
    );
      return response.data
  } catch (error) {
    console.log(error);
  };
}

//Metodo para obtener todas las tareas preventivas de un equipo
export const getTareasByEquipo = async (id) => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-type": "application/json;",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "tasktodo/listbyequipo/" + id,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Metodo para buscar las tareas no realizadas por un usuario
export const getTaskNotDone = async (userName) => {
  try {
    const name = userName;
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-type": "application/json;",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "tasknotdone/findbyuser/" + name,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
      console.log(error);
  };
};

// Metodo para actualizar las tareas no realizadas por un usuario
export const updateTaskNotDone = async (userId) => {
  try {
    const id = userId
    console.log(id);
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-type": "aplication/json;",
      Authorization: token,
    };
    const response = await axios.put(
      Global.url + "tasknotdone/update/" + id,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
      console.log(error);
  };
};

//Metodo para obtener todas los pedidos de mantenimiento
export const getPedidos = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-type": "application/json;",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "pedidoMant/listall",
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Metodo para Guardar Pedidos de Mantenimiento
export const savePedidos = async (values) => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.post(
      Global.url + "pedidoMant/save",
      values,
      {
        headers: headers,
      }
    );
    console.log("Respuesta Api: " + response.data);
    if (response.data.status === "Success") {
      // Mostrar SweetAlert si la actualización fue exitosa
      Swal.fire({
          icon: 'success',
          title: '¡Pedido Enviado!',
          text: 'El pedido de mantenimiento ha sido creado correctamente.',
      });
  } else {
      // Mostrar SweetAlert si hay un error
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al enviar el pedido.',
      });
  }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para obtener todos los repuestos
export const getRepuestos = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-type": "application/json;",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "repuesto/listall",
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para obtener todos los usuarios
export const getUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-type": "application/json;",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "user/listall",
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para obtener un usuarios
export const getOneUser = async (userID) => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    const id = userID;
    console.log("ID", id);
    let headers = {
      "Content-type": "application/json;",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "user/profile/" + id,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Metodo para Guardar Usuarios (FUNCIONA)!!!
export const saveUsers = async (values) => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.post(
      Global.url + "user/register",
      values,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para modificar los usuarios
export const updateUser = async (userId, values) =>{
  console.log("datos recibidos en API", userId, values)
  try{
    const id = userId
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.put(
      Global.url + "user/update/" + id,
      values,
      {
        headers: headers, 
      }
    );
      return response.data
  } catch (error) {
    console.log(error);
  };

}

//Metodo para eliminar los usuarios
export const deleteUser = async (userId) =>{
  console.log("datos recibidos en API", userId)
  try{
    const id = userId
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.delete(
      Global.url + "user/delete/" + id,
      {
        headers: headers, 
      }
    );
      console.log("Respuesta de axios.delete", response);
      return response
  } catch (error) {
    console.log(error);
  };

}

//Metodo para obtener todos los equipos
export const getEquipos = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "equipo/listall",
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Metodo para Guardar equipos (FUNCIONA)!!!
export const saveEquipos = async (values) => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    };
    const response = await axios.post(
      Global.url + "equipo/save",
      values,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para modificar los equipos
export const updateEquipo = async (equipoId, values) =>{
  console.log("datos recibidos en API", equipoId, values)
  try{
    const id = equipoId;
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.put(
      Global.url + "equipo/update/" + id,
      values,
      {
        headers: headers, 
      }
    );
      console.log("Respuesta de axios.put", response);
      return response
  } catch (error) {
    console.log(error);
  };

}

//Metodo para eliminar equipos
export const deleteEquipo = async (equipoId) =>{
  console.log("datos recibidos en API", equipoId)
  try{
    const id = equipoId
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.delete(
      Global.url + "equipo/delete/" + id,
      {
        headers: headers, 
      }
    );
      console.log("Respuesta de axios.delete", response);
      return response
  } catch (error) {
    console.log(error);
  };

};

//Metodo para obtener un equipo
export const getOneEquipo = async (codigo) => {
  console.log("Codigo recibido", codigo)
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "equipo/listone/" + codigo,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Metodo para modificar equipo subiendo imagen (Esquema de equipo)
export const updateImage = async (formData, equipoId) =>{
try {
  console.log("Datos en uploadImage",formData)
  const id = equipoId;
  const token = localStorage.getItem("token");
  console.log(token);
  let headers = {
    "Content-Type": "multipart/form-data",
    Authorization: token,
  };
  const response = await axios.post(
    Global.url + "equipo/updateimage/" + id,
    formData,
    {
      headers: headers,
    }
  );
  return response.data;
} catch(error) {
  console.log(error);
};
};

// Metodo para Guardar repuestos (FUNCIONA)!!!
export const saveRepuestos = async (values) => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.post(
      Global.url + "repuesto/save",
      values,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para obtener todos los repuestos
export const getRepuesto = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "repuesto/listall",
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para modificar repustos
export const updateRepuesto = async (repuestoId, values) =>{
  console.log("datos recibidos en API", repuestoId, values)
  try{
    const id = repuestoId;
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.put(
      Global.url + "repuesto/update/" + id,
      values,
      {
        headers: headers, 
      }
    );
      console.log("Respuesta de axios.put", response);
      return response
  } catch (error) {
    console.log(error);
  };

}

//Metodo para eliminar repuestos
export const deleteRepuesto = async (repuestoId) =>{
  console.log("datos recibidos en API", repuestoId)
  try{
    const id = repuestoId
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.delete(
      Global.url + "repuesto/delete/" + id,
      {
        headers: headers, 
      }
    );
      console.log("Respuesta de axios.delete", response);
      return response
  } catch (error) {
    console.log(error);
  };

};

//Metodo para obtener listado de repuestos en falta
export const getRepuestoFaltante = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "repuesto/listbycuantity",
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para obtener todas las tareas
export const getTask = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "task/listall",
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
// Metodo para Guardar tareas
export const saveTask = async (values) => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.post(
      Global.url + "task/save",
      values,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para eliminar tareas
export const deleteTask = async (tareaId) =>{
  console.log("datos recibidos en API", tareaId)
  try{
    const id = tareaId
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.delete(
      Global.url + "task/delete/" + id,
      {
        headers: headers, 
      }
    );
      console.log("Respuesta de axios.delete", response);
      return response
  } catch (error) {
    console.log(error);
  };

};

// Metodo para guardar Preventivo
export const savePreventivo = async (values) => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.post(
      Global.url + "tasktodo/save",
      values,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para modificar tarea
export const updateTask = async (taskId, values) =>{
  console.log("datos recibidos en API", taskId, values)
  try{
    const id = taskId;
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.put(
      Global.url + "task/update/" + id,
      values,
      {
        headers: headers, 
      }
    );
      console.log("Respuesta de axios.put", response);
      return response
  } catch (error) {
    console.log(error);
  };

}

// Método para obtener todas los Correctivos
export const getCorrectivo = async (searchTerm = "") => {
  try {
    const token = localStorage.getItem("token");
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const url = Global.url + "correctivo/listall";
    const searchParams = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
    const response = await axios.get(`${url}${searchParams}`, {
      headers: headers,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

//Metodo para eliminar correctivos
export const deleteCorrectivo = async (optionId) =>{
  console.log("datos recibidos en API", optionId)
  try{
    const id = optionId
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.delete(
      Global.url + "Correctivo/delete/" + id,
      {
        headers: headers, 
      }
    );
      console.log("Respuesta de axios.delete", response);
      return response
  } catch (error) {
    console.log(error);
  };

};

//Metodo para guardar un Correctivo
export const saveCorrectivo = async (values) => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.post(
      Global.url + "correctivo/save",
      values,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response.data.mensaje === "Cantidad insuficiente de repuesto") {
      Swal.fire ({
        icon: "error",
        title: "No hay suficientes repuestos para esta reparación",
        showConfirmButton: true,
      })
    }
  }
};

//Metodo para modificar Correctivo
export const updateCorrectivo = async (optionId, values) =>{
  console.log("datos recibidos en API", optionId, values)
  try{
    const id = optionId;
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.put(
      Global.url + "correctivo/update/" + id,
      values,
      {
        headers: headers, 
      }
    );
      console.log("Respuesta de axios.put", response);
      return response
  } catch (error) {
    console.log(error);
  };

}

//Metodo para modificar PedidoMantenimiento
export const updatePedidoMant = async (pedidoId, values) =>{
  console.log("datos recibidos en API", pedidoId, values)
  try{
    const id = pedidoId;
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.put(
      Global.url + "pedidomant/update/" + id,
      values,
      {
        headers: headers, 
      }
    );
      console.log("Respuesta de axios.put", response);
      return response
  } catch (error) {
    console.log(error);
  };

}

//Metodo para obtener los pedidos de mantenimiento no cumplidos
export const getPedidoMantNotDone = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "pedidomant/listnotdone",
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para obtener las tareas no realizadas
export const getAllTaskNotDone = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-type": "application/json;",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "tasknotdone/listall/",
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
      console.log(error);
  };
};

//Metodo para guardar una Pirometria
export const savePirometria = async (values) => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.post(
      Global.url + "pirometria/save",
      values,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para obtener todas las pirometrias
export const getPirometria = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "pirometria/listall",
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para eliminar Pirometrias
export const deletePirometria = async (optionId) =>{
  console.log("datos recibidos en API", optionId)
  try{
    const id = optionId
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.delete(
      Global.url + "pirometria/delete/" + id,
      {
        headers: headers, 
      }
    );
      console.log("Respuesta de axios.delete", response);
      return response
  } catch (error) {
    console.log(error);
  };

};

//Metodo para modificar Pirometria
export const updatePirometria = async (pedidoId, values) =>{
  console.log("datos recibidos en API", pedidoId, values)
  try{
    const id = pedidoId;
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.put(
      Global.url + "pirometria/update/" + id,
      values,
      {
        headers: headers, 
      }
    );
      console.log("Respuesta de axios.put", response);
      return response
  } catch (error) {
    console.log(error);
  };
}

//Metodo para modificar inicio pirometria
export const updateInicioPiro = async (piroId) =>{
  console.log("datos recibidos en API", piroId)
  try{
    const id = piroId
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.get(
      Global.url + "pirometria/updateinicio/" + id,
      {
        headers: headers, 
      }
    );
      return response.data
  } catch (error) {
    console.log(error);
  };
};

//Metodo para obtener las pirometrias iniciadas
export const getPiroInit = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "pirometria/listbyinicio",
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para guardar una Pirometria hecha
export const savePirometriaDone = async (values) => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.post(
      Global.url + "pirometriadone/save",
      values,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para obtener las pirometrias hechas
export const getPiroDone = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "pirometriadone/listall",
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para modificar PirometriaDone
export const updatePiroDone = async (piroId, values) =>{
  console.log("datos recibidos en API", piroId, values)
  try{
    const id = piroId;
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response   = await axios.put(
      Global.url + "pirometriadone/update/" + id,
      values,
      {
        headers: headers, 
      }
    );
      console.log("Respuesta de axios.put", response);
      return response
  } catch (error) {
    console.log(error);
  };
}

//Metodo para obtener todas las bitacoras
export const getBitacoras = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.get(
      Global.url + "bitacora/listall",
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Método para modificar registro Bitacora
export const updateBitacora = async (bitacoraId, newContent) => {
  const id = bitacoraId;
  const content = newContent;
  console.log("datos recibidos en API", id);
  console.log("datos recibidos en API", content);
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response = await axios.put(
      Global.url + "bitacora/update/" + id,
      { content },  // Datos enviados en el cuerpo de la solicitud
      {
        headers: headers,
      }
    );
    if (response.data.status === "Success") {
      // Mostrar SweetAlert si la actualización fue exitosa
      Swal.fire({
          icon: 'success',
          title: '¡Actualización exitosa!',
          text: 'El contenido ha sido actualizado correctamente.',
      });
  } else {
      // Mostrar SweetAlert si hay un error
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al actualizar el contenido.',
      });
  }

  return response.data;
} catch (error) {
  console.log(error);
}
};

//Metodo para guardar una Bitacora
export const saveBitacora = async (content) => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.post(
      Global.url + "bitacora/save",
      content,
      {
        headers: headers,
      }
    );
    if (response.data.status === "Success") {
      // Mostrar SweetAlert si la actualización fue exitosa
      Swal.fire({
          icon: 'success',
          title: '¡Bitacora creada!',
          text: 'El contenido ha sido creado correctamente.',
      });
  } else {
      // Mostrar SweetAlert si hay un error
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al crear la bitacora.',
      });
  }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Metodo para eliminar una Bitacora
export const deleteBitacora = async (Id) => {
  try {
    const id = Id
    const token = localStorage.getItem("token");
    console.log(token);
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    const response = await axios.delete(
      Global.url + "bitacora/delete/" + id,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};