import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { saveTask, updateTask } from "../configuracion/api";
import Swal from "sweetalert2";

const FormTask = ({ mode, task, updateTaskList, updateOk }) => {
  const initialValues = { task: mode === "Edit" && task ? task.task : "" };

  const validationSchema = Yup.object({
    task: Yup.string().required("La tarea es obligatoria"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      let response;
      if (mode === "Edit") {
        response = await updateTask(task._id, values);
        updateOk();
        if (response.data.status === "Success") {
          await Swal.fire({ icon: "success", title: "Operación exitosa", showConfirmButton: false, timer: 1500 });
          resetForm();
          updateTaskList();
        }
      } else {
        response = await saveTask(values);
        if (response.status === "Success") {
          await Swal.fire({ icon: "success", title: "Operación exitosa", showConfirmButton: false, timer: 1500 });
          resetForm();
          updateTaskList();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      <Form className="flex flex-col gap-4">
        <div>
          <label htmlFor="task" className="f-label">Descripción de la tarea</label>
          <Field type="text" id="task" name="task" className="f-input" />
          <ErrorMessage name="task" component="p" className="f-error" />
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

export default FormTask;
