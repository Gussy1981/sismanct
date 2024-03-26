import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, FormGroup } from "react-bootstrap";
import { saveUsers, updateUser } from "../configuracion/api";
import Swal from "sweetalert2";

const FormUser = ({ mode, user, updateUserList, updateOk }) => {

  console.log(mode, user);

  const initialValues = {
    name: "",
    surname: "",
    dni: "",
    role: "Empleado",
  };

  if (mode === "Edit" && user) {
    initialValues.name = user.name || "";
    initialValues.surname = user.surname || "";
    initialValues.dni = user.dni;
    initialValues.role = user.role || "Empleado";
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es obligatorio"),
    surname: Yup.string(),
    dni:
      mode !== "Edit"
        ? Yup.string().required("El DNI es obligatorio")
        : Yup.string(),
    role: Yup.string().required("El rol es obligatorio"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    console.log("Valores enviados:", values);
    try {
      let response;

      if (mode === "Edit") {
        response = await updateUser(user._id, values);
        updateOk();

      } else {
        response = await saveUsers(values);
      }
      console.log(response);

      if (response) {
        await Swal.fire({
          icon: "success",
          title: "La operación fue exitosa",
          showConfirmButton: false,
          timer: 1500,
        });
        resetForm();
        updateUserList();
      } else {
        console.error("Error al guardar registro:", response);
      }
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
            <Col>
              <FormGroup>
                <label htmlFor="name">Nombre</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-danger"
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <label htmlFor="surname">Apellido</label>
                <Field
                  type="text"
                  id="surname"
                  name="surname"
                  className="form-control"
                />
                <ErrorMessage
                  name="surname"
                  component="div"
                  className="text-danger"
                />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <label htmlFor="dni">DNI</label>
            <Field
              type="text"
              id="dni"
              name="dni"
              className="form-control"
              disabled={mode === "Edit"}
            />
            <ErrorMessage name="dni" component="div" className="text-danger" />
          </FormGroup>
          <FormGroup>
            <label htmlFor="role">Rol</label>
            <Field as="select" id="role" name="role" className="form-control">
              <option value="Empleado">Empleado</option>
              <option value="Administrador">Administrador</option>
            </Field>
            <ErrorMessage name="role" component="div" className="text-danger" />
          </FormGroup>
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

export default FormUser;
