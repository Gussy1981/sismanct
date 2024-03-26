import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Container, Row, FormGroup } from "react-bootstrap";
import { saveTask, updateTask } from "../configuracion/api";
import * as Yup from "yup";
import Swal from "sweetalert2";

const FormTask = ({ mode, task, updateTaskList, updateOk}) => {

  const initialValues={
    task: "",
  };

  if (mode === "Edit" && task) {
    initialValues.task = task.task;
  }
  
  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    task: Yup.string().required("La tarea es obligatoria"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    console.log("Valores recibidos del form: ", values);
    try {
      let response;

      if (mode === "Edit") {
        response = await updateTask(task._id, values);
        updateOk();
        if (response.data.status === "Succes") {
          await Swal.fire({
            icon: "success",
            title: "La operación fue exitosa",
            showConfirmButton: false,
            timer: 1500,
          });
          resetForm();
          updateTaskList();
        } else {
          console.error("Error al guardar Tarea:", response);
        }
        

      } else {
        response = await saveTask(values);
        if (response.status === "Succes") {
          await Swal.fire({
            icon: "success",
            title: "La operación fue exitosa",
            showConfirmButton: false,
            timer: 1500,
          });
          resetForm();
          updateTaskList();
        } else {
          console.error("Error al guardar Tarea:", response);
        }
      }
      console.log(response);
      
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Formik
       initialValues={initialValues}
       validationSchema={validationSchema}
       onSubmit={handleSubmit}
      >
        <Form>
          <Row>
            <FormGroup>
              <label htmlFor="task">Ingrese una Tarea</label>
              <Field
                type="text"
                id="task"
                name="task"
                className="form-control"
              />
              <ErrorMessage
                name="task"
                component="div"
                className="text-danger"
              />
            </FormGroup>
          </Row>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
           {mode === "Edit" ? "Modificar" : "Guardar"}
          </button>
        </Form>
      </Formik>
    </Container>
  );
};

export default FormTask;
