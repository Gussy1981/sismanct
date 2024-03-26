import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, FormGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import { saveEquipos, updateEquipo, updateImage } from "../configuracion/api";

const FormEquipos = ({ mode, equipo, updateEquipoList, updateOk }) => {
  console.log(mode, equipo);

  const initialValues = {
    clasificacion: "Maquina",
    codigo: "",
    tipo: "",
    temperaturaDeTrabajo: "",
    urlImagen: "",
    caracteristicasDeCalentamiento: "",
  };

  if (mode === "Edit" && equipo) {
    initialValues.clasificacion = equipo.clasificacion || "Maquina";
    initialValues.codigo = equipo.codigo || "";
    initialValues.tipo = equipo.tipo;
    initialValues.temperaturaDeTrabajo = equipo.temperaturaDeTrabajo;
    initialValues.urlImagen = equipo.urlImagen || "";
    initialValues.caracteristicasDeCalentamiento =
      equipo.caracteristicasDeCalentamiento;
  }

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    clasificacion: Yup.string().required("La clasificación es obligatoria"),
    codigo: Yup.string().required("El código es obligatorio"),
    tipo: Yup.string().required("El tipo es obligatorio"),
    temperaturaDeTrabajo: Yup.string().required(
      "La temperatura de trabajo es obligatoria. Ej: 100-800"
    ),

    caracteristicasDeCalentamiento: Yup.string().required(
      "Las caracteristicas son requeridas"
    ),
  });

  const handleSubmit = async (values, { resetForm }) => {
    console.log("Valores recibidos del form: ", values);

    try {
      let response;
  
      if (mode === "Edit") {
        const fileInput = document.querySelector("#file");
  
        if (fileInput.files[0]) {
          const formData = new FormData();
          formData.append("file0", fileInput.files[0]);
  
          // Sube la imagen y espera la respuesta
          const imageResponse = await updateImage(formData, equipo._id);
  
          if (imageResponse.status === "Succes") {
            // Si la carga de imagen es exitosa, actualiza el equipo
            response = await updateEquipo(equipo._id, {
              ...values,
              urlImagen: imageResponse.url, // Actualiza la URL de la imagen en los valores
            });
            updateOk();
          } else {
            // Maneja el caso en el que la carga de la imagen falla
            console.error("Error al subir la imagen:", imageResponse);
          }
        } else {
          response = await updateEquipo(equipo._id, values);
          if (response.data.status === "Success") {
            await Swal.fire({
              icon: "success",
              title: "Registro modificado correctamente",
              showConfirmButton: false,
              timer: 1500,
            });
            resetForm();
            updateOk();
            updateEquipoList();
          } else {
            await Swal.fire({
              icon: "error",
              title: "No se pudo modificar el registro",
              showConfirmButton: false,
              timer: 1500,
            });
          };
        }
      } else {
        // Guardo un nuevo registro
            response = await saveEquipos(values);
          } 
  
      if (response.status === "Success") {
        await Swal.fire({
          icon: "success",
          title: "La operación fue exitosa",
          showConfirmButton: false,
          timer: 1500,
        });
        resetForm();
        updateEquipoList();
      } else {
        console.error("Error al guardar Equipo:", response);
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
        {({ setFieldValue, values }) => (
          <Form encType="multipart/form-data">
            <Row>
              <Col md={6}>
                <FormGroup>
                  <label htmlFor="clasificacion">Clasificación</label>
                  <Field
                    as="select"
                    id="clasificacion"
                    name="clasificacion"
                    className="form-control"
                  >
                    <option value="Maquina">Maquina</option>
                    <option value="Infraestructura">Infraestructura</option>
                  </Field>
                  <ErrorMessage
                    name="clasificacion"
                    component="div"
                    className="text-danger"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <label htmlFor="codigo">Código</label>
                  <Field
                    type="text"
                    id="codigo"
                    name="codigo"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="codigo"
                    component="div"
                    className="text-danger"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <label htmlFor="tipo">Tipo</label>
                  <Field
                    type="text"
                    id="tipo"
                    name="tipo"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="tipo"
                    component="div"
                    className="text-danger"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <label htmlFor="temperaturaDeTrabajo">
                    Temperatura de Trabajo:
                  </label>
                  <Field
                    type="text"
                    id="temperaturaDeTrabajo"
                    name="temperaturaDeTrabajo"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="temperaturaDeTrabajo"
                    component="div"
                    className="text-danger"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <label htmlFor="caracteristicasDeCalentamiento">
                    Características de Calentamiento:
                  </label>
                  <Field
                    as="textarea"
                    id="caracteristicasDeCalentamiento"
                    name="caracteristicasDeCalentamiento"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="caracteristicasDeCalentamiento"
                    component="div"
                    className="text-danger"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="pt-3">
              <Col>
                <FormGroup>
                  <label htmlFor="urlImagen" className="pr-4">
                    Subir Imagen de Esquema:
                  </label>
                  <input
                    type="file"
                    name="file0"
                    id="file"
                    onChange={(event) => {
                      // Actualiza el valor de Field y almacena el archivo seleccionado en "values.file0"
                      setFieldValue("file0", event.currentTarget.files[0]);
                    }
                  }
                  />
                  <ErrorMessage
                    name="file0"
                    component="div"
                    className="text-danger"
                  />
                </FormGroup>
              </Col>
            </Row>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {mode === "Edit" ? "Modificar" : "Guardar"}
            </button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default FormEquipos;
