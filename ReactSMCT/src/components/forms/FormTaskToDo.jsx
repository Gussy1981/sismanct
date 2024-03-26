import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  getEquipos,
  getTask,
  getUsers,
  saveTask,
  savePreventivo,
  updateTarea,
} from "../configuracion/api";
import { Container, Row, Col, FormGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import * as Yup from "yup";

const FormTaskToDo = ({ mode, taskToModify, updateTaskList, updateOk }) => {
  // Definición de estados para listas de opciones y visibilidad de TaskForm
  const [equipos, setEquipos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [encargados, setEncargados] = useState([]);
  const [visible, setVisible] = useState(false);
  const [newTask, setNewTask] = useState("");

  console.log("Tarea a modificar", taskToModify);

  const initialValues = {
    equipo: "",
    tarea: "",
    encargado: "",
    frecuencia: "Diaria",
    ultimaEjecucion: null,
    estado: false,
    fechaConsulta: null,
  };

  if (mode === "Edit" && taskToModify) {
    initialValues.equipo = taskToModify.equipo;
    initialValues.tarea = taskToModify.tarea;
    initialValues.encargado = taskToModify.encargado;
    initialValues.frecuencia = taskToModify.frecuencia;
  }

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    equipo: Yup.string().required("El equipo es obligatorio"),
    tarea: Yup.string().required("La tarea es obligatoria"),
    encargado: Yup.string().required("El encargado es obligatorio"),
    frecuencia: Yup.string().required("La frecuencia es obligatoria"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    console.log(values); // Valores del formulario
    try {
      let response;
      if (mode !== "Edit") {
        response = await savePreventivo(values);
      } else {
        response = await updateTarea(values);
        updateTaskList();
        updateOk();
      }

      if (response.status === "Succes")
        await Swal.fire({
          icon: "success",
          title: "Nuevo Preventivo Guardado",
          showConfirmButton: false,
          timer: 1500,
        });
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  // Función para cargar la lista de equipos
  const loadEquipos = async () => {
    const equiposData = await getEquipos();
    const sortedByCodigo = equiposData.equipo.sort((a, b) =>
      a.codigo.localeCompare(b.codigo)
    );
    setEquipos({ equipo: sortedByCodigo });
  };

  // Función para cargar la lista de tareas
  const loadTareas = async () => {
    const tareasData = await getTask();
    console.log("tareasData", tareasData);
    setTareas(tareasData);
  };

  // Función para cargar la lista de encargados
  const loadEncargados = async () => {
    const users = await getUsers();
    setEncargados(users);
  };

  useEffect(() => {
    loadEquipos();
    loadTareas();
    loadEncargados();
  }, []);

  const handleAddTask = async () => {
    try {
      const response = await saveTask({ task: newTask });
      console.log("Respuesta de saveTask", response);
      if (response.status === "Succes") {
        await Swal.fire({
          icon: "success",
          title: "Nueva Tarea Guardada",
          showConfirmButton: false,
          timer: 1500,
        });
        setVisible(false);
        loadTareas();
      } else {
        console.error("Error al guardar tarea:", response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelTask = () => {
    setVisible(false);
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
              <label htmlFor="equipo">Equipo</label>
              <Field
                as="select"
                id="equipo"
                name="equipo"
                className="form-control"
              >
                <option value="">Selecciona un equipo</option>
                {equipos.equipo &&
                  equipos.equipo.map((equipo) => (
                    <option key={equipo.codigo} value={equipo.codigo}>
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
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <label htmlFor="tarea">Tarea</label>
                <Field
                  as="select"
                  id="tarea"
                  name="tarea"
                  className="form-control"
                >
                  <option value="">Selecciona una tarea</option>
                  {tareas.tarea &&
                    tareas.tarea.map((tarea) => (
                      <option key={tarea._id} value={tarea.task}>
                        {tarea.task}
                      </option>
                    ))}
                </Field>
                <ErrorMessage
                  name="tarea"
                  component="div"
                  className="text-danger"
                />
              </FormGroup>
            </Col>
            <Col>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setVisible(true)}
              >
                Agregar Tarea
              </button>
            </Col>
          </Row>
          {visible ? (
            <Row>
              <FormGroup>
                <label htmlFor="task">Ingrese una Tarea</label>
                <Field
                  type="text"
                  id="task"
                  name="task"
                  className="form-control"
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <ErrorMessage
                  name="task"
                  component="div"
                  className="text-danger"
                />
              </FormGroup>
              <Col>
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    handleAddTask();
                  }}

                >
                  Guardar Tarea
                </button>
              </Col>
              <Col>
                <button
                  type="button"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                  onClick={() => handleCancelTask()}
                >
                  Cancelar
                </button>
              </Col>
            </Row>
          ) : null}
          <Row>
            <FormGroup>
              <label htmlFor="encargado">Encargado</label>
              <Field
                as="select"
                id="encargado"
                name="encargado"
                className="form-control"
              >
                <option value="">Selecciona un encargado</option>
                {encargados.users &&
                  encargados.users.map((encargado) => (
                    <option key={encargado._id} value={encargado.name}>
                      {encargado.name}
                    </option>
                  ))}
              </Field>
              <ErrorMessage
                name="encargado"
                component="div"
                className="text-danger"
              />
            </FormGroup>
          </Row>
          <Row>
            <FormGroup>
              <label htmlFor="frecuencia">Frecuencia</label>
              <Field
                as="select"
                id="frecuencia"
                name="frecuencia"
                className="form-control"
              >
                <option value="Diaria">Diaria</option>
                <option value="Semanal">Semanal</option>
                <option value="Quincenal">Quincenal</option>
                <option value="Mensual">Mensual</option>
              </Field>
              <ErrorMessage
                name="frecuencia"
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

export default FormTaskToDo;
