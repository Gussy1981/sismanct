import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, FormGroup } from "react-bootstrap";
import {
  getEquipos,
  saveRepuestos,
  updateRepuesto,
} from "../configuracion/api";
import Swal from "sweetalert2";

const FormRepuesto = ({ mode, repuesto, updateRepuestoList, updateOk }) => {
  const [optionEquipos, setOptionEquipos] = useState([]);
  console.log(mode, repuesto);

  useEffect(() => {
    const dataEquipos = async () => {
      try {
        const response = await getEquipos();
        const sortedResponse = response.equipo.sort((a, b) =>
          a.codigo.localeCompare(b.codigo)
        );
        setOptionEquipos({ equipo: sortedResponse });
      } catch (error) {
        console.log(error);
      }
    };
    dataEquipos();
  }, []);

  console.log(optionEquipos);

  const initialValues = {
    nombre: "",
    marca: "",
    tipo: "",
    otras: "",
    cantidad: 0,
    minStock: 1,
    precio: 0,
    equipo: "",
  };

  if (mode === "Edit" && repuesto) {
    initialValues.nombre = repuesto.nombre || "";
    initialValues.marca = repuesto.marca || "";
    initialValues.tipo = repuesto.tipo || "";
    initialValues.otras = repuesto.otras || "";
    initialValues.cantidad = repuesto.cantidad || "";
    initialValues.minStock = repuesto.minStock || "";
    initialValues.precio = repuesto.precio || "";
    initialValues.equipo = repuesto.equipo || "";
  }

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    marca: Yup.string(),
    tipo: Yup.string(),
    otras: Yup.string(),
    cantidad: Yup.number().required("La cantidad es obligatoria"),
    minStock: Yup.number().required("La cantidad mínima es obligatoria"),
    precio: Yup.number().required("El costo individual es obligatorio"),
    equipo: Yup.string().required("El equipo es obligatorio"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    console.log("Valores recibidos del form: ", values);
    try {
      let response;
      if (mode === "Edit") {
        response = await updateRepuesto(repuesto._id, values);
        if (response.data.status === "Success") {
          await Swal.fire({
            icon: "success",
            title: "Registro Modificado",
            showConfirmButton: false,
            timer: 1500,
          });
          resetForm();
          updateRepuestoList();
          updateOk();
        } else {
          console.error("Error al guardar Repuesto:", response);
        }
      } else {
        response = await saveRepuestos(values);
      }
      console.log(response);

      if (response.status === "Success") {
        await Swal.fire({
          icon: "success",
          title: "La operación fue exitosa",
          showConfirmButton: false,
          timer: 1500,
        });
        resetForm();
        updateRepuestoList();
      } else {
        console.error("Error al guardar Repuesto:", response);
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
                <label htmlFor="nombre">Nombre</label>
                <Field
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="form-control"
                />
                <ErrorMessage
                  name="nombre"
                  component="div"
                  className="text-danger"
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <label htmlFor="marca">Marca</label>
                <Field
                  type="text"
                  id="marca"
                  name="marca"
                  className="form-control"
                />
                <ErrorMessage
                  name="marca"
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
                <label htmlFor="otras">Otras Características</label>
                <Field
                  as="textarea"
                  id="otras"
                  name="otras"
                  className="form-control"
                  rows={4}
                />
                <ErrorMessage
                  name="otras"
                  component="div"
                  className="text-danger"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <label htmlFor="cantidad">Cantidad</label>
                <Field
                  type="number"
                  id="cantidad"
                  name="cantidad"
                  className="form-control"
                />
                <ErrorMessage
                  name="cantidad"
                  component="div"
                  className="text-danger"
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <label htmlFor="precio">Costo individual</label>
                <Field
                  type="number"
                  id="precio"
                  name="precio"
                  className="form-control"
                />
                <ErrorMessage
                  name="precio"
                  component="div"
                  className="text-danger"
                />
              </FormGroup>    
            </Col>
          </Row>
          <Row>
            <Col>
            <FormGroup>
                <label htmlFor="minStock">Stock Mínimo</label>
                <Field
                  type="number"
                  id="minStock"
                  name="minStock"
                  className="form-control"
                />
                <ErrorMessage
                  name="minStock"
                  component="div"
                  className="text-danger"
                />
              </FormGroup>    
            </Col>
            <Col>
            <FormGroup>
            <label htmlFor="equipo">Equipo</label>
            <Field
              as="select"
              id="equipo"
              name="equipo"
              className="form-control"
            >
              <option value="">Selecciona un equipo</option>
              {optionEquipos.equipo &&
                optionEquipos.equipo.map((equipo) => (
                  <option key={equipo._id} value={equipo.codigo}>
                    {equipo.codigo}
                  </option>
                ))}
            </Field>
            <ErrorMessage
              name="equipo"
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
      </Formik>
    </Container>
  );
};

export default FormRepuesto;
