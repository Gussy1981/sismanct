import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { saveUsers, updateUser } from "../configuracion/api";
import Swal from "sweetalert2";

const FormUser = ({ mode, user, updateUserList, updateOk }) => {
  const initialValues = {
    name:     mode === "Edit" ? user?.name    ?? "" : "",
    surname:  mode === "Edit" ? user?.surname ?? "" : "",
    dni:      "",
    role:     mode === "Edit" ? user?.role    ?? "Empleado" : "Empleado",
  };

  const validationSchema = Yup.object({
    name:    Yup.string().required("El nombre es obligatorio"),
    surname: Yup.string(),
    dni:     mode !== "Edit" ? Yup.string().required("El DNI es obligatorio") : Yup.string(),
    role:    Yup.string().required("El rol es obligatorio"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = { name: values.name, surname: values.surname, role: values.role };
      if (mode !== "Edit" || values.dni) payload.dni = values.dni;

      const response = mode === "Edit"
        ? await updateUser(user._id, payload)
        : await saveUsers(payload);

      if (mode === "Edit") updateOk();

      if (response) {
        await Swal.fire({ icon: "success", title: "Operación exitosa", showConfirmButton: false, timer: 1500 });
        resetForm();
        updateUserList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      <Form className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="f-label">Nombre</label>
            <Field type="text" id="name" name="name" className="f-input" />
            <ErrorMessage name="name" component="p" className="f-error" />
          </div>
          <div>
            <label htmlFor="surname" className="f-label">Apellido</label>
            <Field type="text" id="surname" name="surname" className="f-input" />
            <ErrorMessage name="surname" component="p" className="f-error" />
          </div>
        </div>
        <div>
          <label htmlFor="dni" className="f-label">
            {mode === "Edit" ? "Restablecer contraseña (DNI)" : "DNI"}
          </label>
          <Field type="text" id="dni" name="dni" className="f-input" />
          <ErrorMessage name="dni" component="p" className="f-error" />
          {mode === "Edit" && (
            <p className="text-zinc-500 text-xs mt-1">Dejar en blanco para no modificar la contraseña actual.</p>
          )}
        </div>
        <div>
          <label htmlFor="role" className="f-label">Rol</label>
          <Field as="select" id="role" name="role" className="f-input">
            <option value="Empleado">Empleado</option>
            <option value="Administrador">Administrador</option>
          </Field>
          <ErrorMessage name="role" component="p" className="f-error" />
        </div>
        <div>
          <button type="submit" className="btn-primary">
            {mode === "Edit" ? "Modificar" : "Guardar"}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default FormUser;
