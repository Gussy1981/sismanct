import { useEffect, useState } from "react";
import { getEquipos, getRepuestos, getUsers, saveCorrectivo, updateCorrectivo, updatePedidoMant } from "../configuracion/api";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { handleEnterAsTab } from "../../helpers/formKeyboard";
import { toDateInputValue } from "../../helpers/dateOnly";

const FormCorrectivo = ({ mode, option, updateList, updateOk, pedidoMant }) => {
  const [repuestos,    setRepuestos]    = useState([]);
  const [users,        setUsers]        = useState([]);
  const [fetchEquipos, setFetchEquipos] = useState([]);

  const initialValues = {
    fecha:               mode === "Edit" ? toDateInputValue(option.fecha) : toDateInputValue(pedidoMant?.fecha),
    solicitante:         mode === "Edit" ? option.solicitante : pedidoMant?.solicitante ?? "",
    equipo:              mode === "Edit" ? option.equipo      : pedidoMant?.equipo      ?? "",
    motivo:              mode === "Edit" ? option.motivo      : pedidoMant?.motivo      ?? "",
    tareas:              mode === "Edit" ? option.tareas      : "",
    tiempo:              mode === "Edit" ? option.tiempo      : 0,
    repuestosUtilizados: mode === "Edit"
      ? option.repuestosUtilizados.map((r) => ({ id_repuesto: r.id_repuesto._id, cantidad: r.cantidad, unidad: r.unidad || "Unidad" }))
      : [{ id_repuesto: "", cantidad: 1, unidad: "Unidad" }],
    responsables:        mode === "Edit" ? option.responsables : [""],
  };

  const validationSchema = Yup.object().shape({
    fecha:        Yup.date().required("La fecha es obligatoria"),
    solicitante:  Yup.string().required("El solicitante es obligatorio"),
    equipo:       Yup.string().required("El equipo es obligatorio"),
    motivo:       Yup.string().required("El motivo es obligatorio"),
    tareas:       Yup.string().required("Las tareas son obligatorias"),
    tiempo:       Yup.number().required().positive().integer("El tiempo debe ser entero (minutos)"),
    responsables: Yup.array().min(1).of(Yup.string()).required(),
    repuestosUtilizados: Yup.array().of(Yup.object({
      id_repuesto: Yup.string().required("Seleccioná un repuesto"),
      cantidad: Yup.number().typeError("Ingresá una cantidad").positive("La cantidad debe ser mayor que 0").required("Ingresá una cantidad"),
      unidad: Yup.string().oneOf(["Unidad", "Grs", "Kgs"]).required(),
    })),
  });

  useEffect(() => {
    const load = async () => {
      const [repRes, usrRes, eqRes] = await Promise.all([getRepuestos(), getUsers(), getEquipos()]);
      setRepuestos(repRes.repuesto);
      setUsers(usrRes.users);
      setFetchEquipos(eqRes.equipo.sort((a, b) => a.codigo.localeCompare(b.codigo)));
    };
    load();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      let response;
      if (mode === "Edit") {
        response = await updateCorrectivo(option._id, values);
        updateOk();
      } else if (pedidoMant) {
        response = await saveCorrectivo(values);
        await updatePedidoMant(pedidoMant._id, values);
        updateOk();
        updateList();
      } else {
        response = await saveCorrectivo(values);
      }
      if (response) {
        await Swal.fire({ icon: "success", title: "Operación exitosa", showConfirmButton: false, timer: 1500 });
        resetForm();
        updateList();
      }
    } catch (error) { console.log(error); }
  };

  const selectCls = "f-input";
  const inputCls  = "f-input";
  const equipoPedidoNoCatalogado = pedidoMant?.equipo && !fetchEquipos.some((eq) => eq.codigo === pedidoMant.equipo);

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ values, isSubmitting }) => (
        <Form className="flex flex-col gap-4" onKeyDown={handleEnterAsTab}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="f-label">Fecha</label>
              <Field type="date" name="fecha" className={inputCls} />
              <ErrorMessage name="fecha" component="p" className="f-error" />
            </div>
            <div>
              <label className="f-label">Equipo</label>
              <Field as="select" name="equipo" className={selectCls}>
                <option value="">Selecciona un equipo</option>
                {equipoPedidoNoCatalogado && (
                  <option value={pedidoMant.equipo}>{pedidoMant.equipo} (informado en el pedido)</option>
                )}
                {fetchEquipos.map((eq) => <option key={eq._id} value={eq.codigo}>{eq.codigo}</option>)}
              </Field>
              <ErrorMessage name="equipo" component="p" className="f-error" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="f-label">Solicitante</label>
              <Field type="text" name="solicitante" className={inputCls} />
              <ErrorMessage name="solicitante" component="p" className="f-error" />
            </div>
            <div>
              <label className="f-label">Motivo</label>
              <Field type="text" name="motivo" className={inputCls} />
              <ErrorMessage name="motivo" component="p" className="f-error" />
            </div>
          </div>

          <div>
            <label className="f-label">Tareas realizadas</label>
            <Field as="textarea" name="tareas" rows={3} className={`${inputCls} resize-none`} />
            <ErrorMessage name="tareas" component="p" className="f-error" />
          </div>

          <div className="w-40">
            <label className="f-label">Tiempo (min)</label>
            <Field type="number" name="tiempo" className={inputCls} />
            <ErrorMessage name="tiempo" component="p" className="f-error" />
          </div>

          {/* Repuestos utilizados */}
          <div>
            <p className="f-label mb-2">Repuestos utilizados</p>
            <FieldArray name="repuestosUtilizados">
              {({ push, remove }) => (
                <div className="flex flex-col gap-2">
                  {values.repuestosUtilizados.map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Field as="select" name={`repuestosUtilizados.${index}.id_repuesto`} className={`${selectCls} flex-1`}>
                        <option value="">Selecciona un repuesto</option>
                        {repuestos?.map((r) => <option key={r._id} value={r._id}>{r.nombre} — {r.tipo}</option>)}
                      </Field>
                      <Field type="number" min="0.001" step="any" aria-label="Cantidad" name={`repuestosUtilizados.${index}.cantidad`} className={`${inputCls} w-24`} />
                      <Field as="select" aria-label="Unidad" name={`repuestosUtilizados.${index}.unidad`} className={`${selectCls} w-28`}>
                        <option value="Unidad">Unidad</option>
                        <option value="Grs">Grs</option>
                        <option value="Kgs">Kgs</option>
                      </Field>
                      {index === values.repuestosUtilizados.length - 1 ? (
                        <button type="button" onClick={() => push({ id_repuesto: "", cantidad: 1, unidad: "Unidad" })} className="btn-success shrink-0">+</button>
                      ) : (
                        <button type="button" onClick={() => remove(index)} className="btn-danger shrink-0">−</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>
            <p className="text-zinc-500 text-xs mt-1">Si no se usaron repuestos, seleccioná "Sin Repuestos" con cantidad 1.</p>
          </div>

          {/* Responsables */}
          <div>
            <p className="f-label mb-2">Responsables</p>
            <FieldArray name="responsables">
              {({ push, remove }) => (
                <div className="flex flex-col gap-2">
                  {values.responsables.map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Field as="select" name={`responsables.${index}`} className={`${selectCls} flex-1`}>
                        <option value="">Selecciona un responsable</option>
                        {users?.map((u) => <option key={u._id} value={u.name}>{u.name}</option>)}
                      </Field>
                      {index === values.responsables.length - 1 ? (
                        <button type="button" onClick={() => push("")} className="btn-success shrink-0">+</button>
                      ) : (
                        <button type="button" onClick={() => remove(index)} className="btn-danger shrink-0">−</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>
          </div>

          <div className="pt-2 pb-4 text-center">
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {mode === "Edit" ? "Modificar" : "Guardar"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormCorrectivo;
