import { useState, useEffect } from "react";
import { getUsers, deleteUser } from "../configuracion/api";
import { DataTable } from "mantine-datatable";
import Swal from "sweetalert2";
import FormUser from "../forms/FormUsers";
import { MdDelete, MdEditDocument } from "react-icons/md";

const listadoUsuarios = () => {
  const [usuarios, setUsuarios] = useState({ users: [] });
  const [mode, setMode] = useState("");
  const [userToModify, setUserToModify] = useState("");
  const [selection, setSelection] = useState(false);

  const handleAdd = () => { setSelection(true); setMode("Add"); };
  const handleBack = () => { setSelection(false); setMode(""); };

  const data = async () => {
    const usuariosData = await getUsers();
    setUsuarios(usuariosData);
  };

  useEffect(() => { data(); }, []);

  const handleChange = (user) => { setMode("Edit"); setUserToModify(user); setSelection(true); };
  const updateUserList = () => data();
  const updateOk = () => { setSelection(false); setMode(""); };

  const handleDelete = (userId, userName) => {
    Swal.fire({
      title: `¿Estás seguro que querés eliminar a ${userName}?`,
      icon: "warning", showCancelButton: true,
      confirmButtonText: "Eliminar", cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(userId)
          .then((response) => {
            if (response.data.status === "Success") { Swal.fire("¡Usuario eliminado!", "", "success"); data(); }
            else Swal.fire("Error", response.data.message, "error");
          })
          .catch(() => Swal.fire("Error", "Hubo un problema al eliminar el usuario", "error"));
      }
    });
  };

  const columns = [
    { accessor: "name",    title: "Nombre" },
    { accessor: "surname", title: "Apellido" },
    { accessor: "role",    title: "Rol" },
    {
      accessor: "acciones", title: "", textAlign: "center",
      render: (user) => (
        <div className="flex justify-center gap-3">
          <button className="text-yellow-400 hover:text-yellow-300 text-xl transition-colors" title="Modificar" onClick={() => handleChange(user)}>
            <MdEditDocument />
          </button>
          <button className="text-red-500 hover:text-red-400 text-xl transition-colors" title="Eliminar" onClick={() => handleDelete(user._id, user.name)}>
            <MdDelete />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="px-3 mb-4">
        {!selection
          ? <button className="btn-success" onClick={handleAdd}>Agregar Usuario</button>
          : <button className="btn-secondary" onClick={handleBack}>Volver</button>}
      </div>
      {mode === "Edit" ? (
        <FormUser mode={mode} user={userToModify} updateUserList={updateUserList} updateOk={updateOk} />
      ) : mode === "Add" ? (
        <FormUser mode={mode} updateUserList={updateUserList} />
      ) : (
        <DataTable columns={columns} records={usuarios.users ?? []} withTableBorder borderRadius="sm" striped highlightOnHover minHeight={150} noRecordsText="No hay usuarios registrados" />
      )}
    </div>
  );
};

export default listadoUsuarios;
