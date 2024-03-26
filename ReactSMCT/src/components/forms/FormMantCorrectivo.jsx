import React, { useEffect, useState } from "react";
import {
  getEquipos,
  getRepuestos,
  getUsers,
  saveCorrectivo,
  updateCorrectivo,
  updatePedidoMant,
} from "../configuracion/api";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Formik, FieldArray, ErrorMessage } from "formik";
import { DateTime } from "luxon";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const FormCorrectivo = ({ mode, option, updateList, updateOk, pedidoMant }) => {
  console.log(mode, option);
  console.log(mode, pedidoMant);

  const initialValues = {
    fecha: "",
    solicitante: "",
    equipo: "",
    motivo: "",
    tareas: "",
    tiempo: 0,
    repuestosUtilizados: [{ id_repuesto: "", cantidad: 0 }],
    responsables: [""],
  };

  if (mode === "Edit" && option) {
    (initialValues.fecha = DateTime.fromISO(option.fecha).toFormat(
      "yyyy-MM-dd"
    )),
      (initialValues.solicitante = option.solicitante),
      (initialValues.equipo = option.equipo),
      (initialValues.motivo = option.motivo),
      (initialValues.tareas = option.tareas),
      (initialValues.tiempo = option.tiempo),
      (initialValues.repuestosUtilizados = option.repuestosUtilizados.map(
        (repuesto) => ({
          id_repuesto: repuesto.id_repuesto._id,
          cantidad: repuesto.cantidad,
        })
      )),
      (initialValues.responsables = option.responsables);
  } else if (mode === "Add" && pedidoMant) {
    (initialValues.fecha = ""),
      (initialValues.solicitante = pedidoMant.solicitante),
      (initialValues.equipo = pedidoMant.equipo),
      (initialValues.motivo = pedidoMant.motivo),
      (initialValues.tareas = ""),
      (initialValues.tiempo = ""),
      (initialValues.repuestosUtilizados = [{ id_repuesto: "", cantidad: 0 }]),
      (initialValues.responsables = [""]);
  }

  const validationSchema = Yup.object().shape({
    fecha: Yup.date().required("La fecha es obligatoria"),
    solicitante: Yup.string().required("Se debe ingresar un solicitante"),
    equipo: Yup.string().required("El equipo es obligatorio"),
    motivo: Yup.string().required("El motivo es obligatorio"),
    tareas: Yup.string().required("Las tareas son obligatorias"),
    tiempo: Yup.number()
      .required("El tiempo es obligatorio")
      .positive("El tiempo debe ser mayor a cero")
      .integer("El tiempo debe ser un valor entero (minutos)"),
    repuestosUtilizados: Yup.array().of(
      Yup.object().shape({
        id_repuesto: Yup.string().notRequired(),
        cantidad: Yup.number().positive().integer().notRequired(),
      }).notRequired()
    ),
    responsables: Yup.array()
      .min(1, "Se debe agregar al menos un responsable")
      .of(Yup.string())
      .required("El/Los responsables es obligatorio"),
  });

  //Declaración de estados
  const [repuestos, setRepuestos] = useState([]);
  const [users, setUsers] = useState([]);
  const [fetchEquipos, setFetchEquipos] = useState([]);


  const handleSubmit = async (values, { resetForm }) => {
    console.log("Valores recibidos del form: ", values);
    try {

      let response;
      let pedidoMantResponse;

      console.log("Verifico datos en handleSubmit", mode, pedidoMant);

      if (mode === "Edit") {

        response = await updateCorrectivo(option._id, values);
        if (response) {
          await Swal.fire({
            icon: "success",
            title: "La operación fue exitosa",
            showConfirmButton: false,
            timer: 1500,
          });
          resetForm();
          updateList();
          updateOk();
        } else {
          console.error("Error al guardar Correctivo:", response);
        }

      } else if (mode === "Add" && pedidoMant) {
        console.log("Estoy en modo Add y PedidoMant");
        response = await saveCorrectivo(values);
        console.log("desde intento de guardar", pedidoMant._id, values);
        pedidoMantResponse = await updatePedidoMant(pedidoMant._id, values);
        if (response) {
          await Swal.fire({
            icon: "success",
            title: "La operación fue exitosa",
            showConfirmButton: false,
            timer: 1500,
          });
          resetForm();
          updateList();
          updateOk();
        } else {
          console.error("Error al guardar Correctivo:", response);
        }

      } else {
        response = await saveCorrectivo(values);
        if (response) {
          await Swal.fire({
            icon: "success",
            title: "La operación fue exitosa",
            showConfirmButton: false,
            timer: 1500,
          });
          resetForm();
          updateList();
        } else {
          console.error("Error al guardar Correctivo:", response);
        }
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const loadRepuestos = async () => {
    try {
      const repuestosData = await getRepuestos();
      setRepuestos(repuestosData.repuesto);
    } catch (error) {
      console.log(error);
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData.users);
    } catch (error) {
      console.log(error);
    }
  };

  const loadEquipos = async () => {
    try {
      const response = await getEquipos();
      const sortedResponse = response.equipo.sort((a, b) =>
        a.codigo.localeCompare(b.codigo)
      );
      setFetchEquipos({ equipo: sortedResponse });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadRepuestos();
    loadUsers();
    loadEquipos();
  }, []);

  return (
    <Container className="mt-1">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, handleChange, values, isSubmitting, resetForm }) => (
          <Form onSubmit={handleSubmit}>
            <Row className="justify-content-center">
              <Col>
                <Form.Group className="mb-3" controlId="fecha">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha"
                    value={values.fecha}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="fecha"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <label htmlFor="equipo">Equipo</label>
                  <Form.Control
                    as="select"
                    id="equipo"
                    name="equipo"
                    value={values.equipo}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona un equipo</option>
                    {fetchEquipos.equipo &&
                      fetchEquipos.equipo.map((equipo) => (
                        <option key={equipo._id} value={equipo.codigo}>
                          {equipo.codigo}
                        </option>
                      ))}
                  </Form.Control>
                  <ErrorMessage
                    name="equipo"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3" controlId="solicitante">
                  <Form.Label>Solicitante</Form.Label>
                  <Form.Control
                    type="text"
                    name="solicitante"
                    value={values.solicitante}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="solicitante"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="motivo">
                  <Form.Label>Motivo</Form.Label>
                  <Form.Control
                    type="text"
                    name="motivo"
                    value={values.motivo}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="motivo"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Form.Group className="mb3" controlId="tareas">
                <Form.Label>Tareas Realizadas</Form.Label>
                <Form.Control
                  type="text"
                  name="tareas"
                  value={values.tareas}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="tareas"
                  component="div"
                  className="text-danger"
                />
              </Form.Group>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="tiempo">
                  <Form.Label>Tiempo</Form.Label>
                  <Form.Control
                    type="number"
                    name="tiempo"
                    value={values.tiempo}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="tiempo"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
              </Col>
            </Row>

            <FieldArray name="repuestosUtilizados">
              {({ push, remove }) => (
                <div>
                  <Form.Label>Repuestos Utilizados</Form.Label>
                  {values.repuestosUtilizados.map((repuesto, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <Form.Control
                        as="select"
                        name={`repuestosUtilizados.${index}.id_repuesto`}
                        value={repuesto.id_repuesto}
                        onChange={handleChange}
                      >
                        <option value="">Selecciona un repuesto</option>
                        {repuestos &&
                          repuestos.map((repuesto) => (
                            <option key={repuesto._id} value={repuesto._id}>
                              {repuesto.nombre} - {repuesto.tipo}
                            </option>
                          ))}
                      </Form.Control>
                      <Form.Control
                        type="number"
                        name={`repuestosUtilizados.${index}.cantidad`}
                        value={repuesto.cantidad}
                        onChange={handleChange}
                      />
                      {index === values.repuestosUtilizados.length - 1 ? (
                        <button
                          type="button"
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                          onClick={() => push({ id_repuesto: "", cantidad: 0 })}
                        >
                          +
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                          onClick={() => remove(index)}
                        >
                          -
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>

            <FieldArray name="responsables">
              {({ push, remove }) => (
                <div>
                  <Form.Label>Responsables</Form.Label>
                  {values.responsables.map((nombre, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <Form.Control
                        as="select"
                        name={`responsables.${index}`}
                        value={nombre}
                        onChange={handleChange}
                      >
                        <option value="">Selecciona un responsable</option>
                        {users.map((user) => (
                          <option key={user._id} value={user.name}>
                            {user.name}
                          </option>
                        ))}
                      </Form.Control>

                      {index === values.responsables.length - 1 ? (
                        <button
                          type="button"
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                          onClick={() => push("")}
                        >
                          +
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                          onClick={() => remove(index)}
                        >
                          -
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>

            <div className="text-center pb-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                {mode === "Edit" ? "Modificar" : "Guardar"}
              </button>
            </div>
            <div className="text-center pb-3">Si no se utilizaron repuestos seleccionar la opción Sin Repuestos y setear cantidad en 1</div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default FormCorrectivo;
