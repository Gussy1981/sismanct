import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getEquipos, getTask, getUsers, saveTask, savePreventivo, updateTarea } from "../configuracion/api";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { handleEnterAsTab } from "../../helpers/formKeyboard";

const FormTaskToDo = ({ mode, taskToModify, updateTaskList, updateOk }) => {
  const [equipos, setEquipos]     = useState([]);
  const [tareas, setTareas]       = useState([]);
  const [encargados, setEncargados] = useState([]);
  const [addingTask, setAddingTask] = useState(false);
  const [newTask, setNewTask]     = useState("");

  const initialValues = {
    equipo:       mode === "Edit" ? taskToModify?.equipo     ?? "" : "",
    tarea:        mode === "Edit" ? taskToModify?.tarea      ?? "" : "",
    encargado:    mode === "Edit" ? taskToModify?.encargado  ?? "" : "",
    frecuencia:   mode === "Edit" ? taskToModify?.frecuencia ?? "Diaria" : "Diaria",
    ultimaEjecucion: null,
    estado: false,
    fechaConsulta: null,
  };

  const validationSchema = Yup.object({
    equipo:    Yup.string().required("El equipo es obligatorio"),
    tarea:     Yup.string().required("La tarea es obligatoria"),
    encargado: Yup.string().required("El encargado es obligatorio"),
    frecuencia:Yup.string().required("La frecuencia es obligatoria"),
  });

  const loadData = async () => {
    const [eqRes, tarRes, usrRes] = await Promise.all([getEquipos(), getTask(), getUsers()]);
    setEquipos(eqRes.equipo.sort((a, b) => a.codigo.localeCompare(b.codigo)));
    setTareas(tarRes);
    setEncargados(usrRes);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      let response;
      if (mode !== "Edit") {
        response = await savePreventivo(values);
      } else {
        response = await updateTarea(taskToModify._id, values);
        updateTaskList();
        updateOk();
      }
      if (response?.status === "Success") {
        await Swal.fire({ icon: "success", title: "Preventivo guardado", showConfirmButton: false, timer: 1500 });
        resetForm();
      }
    } catch (error) { console.log(error); }
  };

  const handleAddTask = async () => {
    try {
      const response = await saveTask({ task: newTask });
      if (response.status === "Success") {
        await Swal.fire({ icon: "success", title: "Tarea guardada", showConfirmButton: false, timer: 1500 });
        setAddingTask(false);
        setNewTask("");
        const tarRes = await getTask();
        setTareas(tarRes);
      }
    } catch (error) { console.log(error); }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      <Form className="flex flex-col gap-4" onKeyDown={handleEnterAsTab}>
        <div>
          <label htmlFor="equipo" className="f-label">Equipo</label>
          <Field as="select" id="equipo" name="equipo" className="f-input">
            <option value="">Selecciona un equipo</option>
            {equipos.map((eq) => <option key={eq.codigo} value={eq.codigo}>{eq.codigo}</option>)}
          </Field>
          <ErrorMessage name="equipo" component="p" className="f-error" />
        </div>

        <div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label htmlFor="tarea" className="f-label">Tarea</label>
              <Field as="select" id="tarea" name="tarea" className="f-input">
                <option value="">Selecciona una tarea</option>
                {tareas?.tarea?.map((t) => <option key={t._id} value={t.task}>{t.task}</option>)}
              </Field>
              <ErrorMessage name="tarea" component="p" className="f-error" />
            </div>
            <button type="button" onClick={() => setAddingTask(true)} className="btn-success shrink-0">
              + Agregar
            </button>
          </div>
        </div>

        {addingTask && (
          <div className="bg-zinc-700 border border-zinc-600 rounded-lg p-4 flex flex-col gap-3">
            <div>
              <label className="f-label">Nueva tarea</label>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="f-input"
                placeholder="Descripción de la tarea"
              />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={handleAddTask} className="btn-primary">Guardar</button>
              <button type="button" onClick={() => { setAddingTask(false); setNewTask(""); }} className="btn-secondary">Cancelar</button>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="encargado" className="f-label">Encargado</label>
          <Field as="select" id="encargado" name="encargado" className="f-input">
            <option value="">Selecciona un encargado</option>
            {encargados?.users?.map((u) => <option key={u._id} value={u.name}>{u.name}</option>)}
          </Field>
          <ErrorMessage name="encargado" component="p" className="f-error" />
        </div>

        <div>
          <label htmlFor="frecuencia" className="f-label">Frecuencia</label>
          <Field as="select" id="frecuencia" name="frecuencia" className="f-input">
            <option value="Diaria">Diaria</option>
            <option value="Semanal">Semanal</option>
            <option value="Quincenal">Quincenal</option>
            <option value="Mensual">Mensual</option>
          </Field>
          <ErrorMessage name="frecuencia" component="p" className="f-error" />
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

export default FormTaskToDo;
