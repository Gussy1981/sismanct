import React, { useState, useEffect } from "react";
import { getUsers } from "../configuracion/api";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { deleteUser } from "../configuracion/api";
import FormUser from "../forms/FormUsers";
import { MdDelete, MdEditDocument } from "react-icons/md";

const listadoUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [mode, setMode] = useState(""); // estado para manejar el modo del formulario
  const [userToModify, setUserToModify] = useState(""); // estado que toma el valor de userID para luego pasarlo al form
  const [selection, setSelection] = useState(false);

  const handleAdd = () => {
    setSelection(true);
    setMode("Add");
  };

  const handleBack = () => {
    setSelection(false);
    setMode("");
  };

  const data = async () => {
    const usuariosData = await getUsers();
    setUsuarios(usuariosData);
  };

  useEffect(() => {
    data();
  }, []);

  const handleChange = (user) => {
    setMode("Edit");
    setUserToModify(user);
    setSelection(true);
  };

  const updateUserList = () => {
    data();
  };

  const updateOk = () => {
    setSelection(false);
    setMode("");
  };

  const handleDelete = (userId, userName) => {
    Swal.fire({
      title: `¿Estás seguro que quieres eliminar a ${userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(userId)
          .then((response) => {
            if (response.data.status === "Succes") {
              Swal.fire("¡Usuario eliminado!", "", "success");
              data(); // Actualiza la lista de usuarios después de la eliminación
            } else {
              Swal.fire("Error", response.message, "error");
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire(
              "Error",
              "Hubo un problema al eliminar el usuario",
              "error"
            );
          });
      }
    });
  };

  return (
    <div>
      {!selection ? (
        <div className=" px-3">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAdd()}
          >
            Agregar Usuario
          </button>
        </div>
      ) : (
        <div className=" px-3">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleBack()}
          >
            Volver
          </button>
        </div>
      )}
      {mode === "Edit" ? (
        <FormUser
          mode={mode}
          user={userToModify}
          updateUserList={updateUserList}
          updateOk={updateOk}
        />
      ) : mode === "Add" ? (
        <FormUser mode={mode} updateUserList={updateUserList} />
      ) : (
        <div className="pt-4">
          <Table hover variant="dark">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Rol</th>
                <th>Modificar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.users &&
                usuarios.users.map((user) => {
                  return (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.surname}</td>
                      <td>{user.role}</td>
                      <td>
                        <button
                          className=" text-yellow-600 font-bold h5"
                          onClick={() => handleChange(user)}
                        >
                          <MdEditDocument />
                        </button>
                      </td>
                      <td>
                        <button
                          className=" text-red-600 font-bold h5"
                          onClick={() => handleDelete(user._id, user.name)}
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default listadoUsuarios;
