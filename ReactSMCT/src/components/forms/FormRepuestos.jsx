import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getEquipos, saveRepuestos, updateRepuesto } from "../configuracion/api";
import Swal from "sweetalert2";
import { handleEnterAsTab } from "../../helpers/formKeyboard";

const FormRepuesto = ({ mode, repuesto, updateRepuestoList, updateOk }) => {
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getEquipos();
        const sorted = res.equipo.sort((a, b) => a.codigo.localeCompare(b.codigo));
        setEquipos(sorted);
      } catch (error) { console.log(error); }
    };
    load();
  }, []);

  const initialValues = {
    nombre:  mode === "Edit" ? repuesto?.nombre  ?? "" : "",
    marca:   mode === "Edit" ? repuesto?.marca   ?? "" : "",
    tipo:    mode === "Edit" ? repuesto?.tipo    ?? "" : "",
    otras:   mode === "Edit" ? repuesto?.otras   ?? "" : "",
    cantidad:mode === "Edit" ? repuesto?.cantidad ?? 0 : 0,
    minStock:mode === "Edit" ? repuesto?.minStock ?? 1 : 1,
    precio:  mode === "Edit" ? repuesto?.precio  ?? 0 : 0,
    equipo:  mode === "Edit" ? repuesto?.equipo  ?? "" : "",
    criticidad: mode === "Edit" ? repuesto?.criticidad ?? "Normal" : "Normal",
  };

  const validationSchema = Yup.object({
    nombre:   Yup.string().required("El nombre es obligatorio"),
    cantidad: Yup.number().required("La cantidad es obligatoria"),
    minStock: Yup.number().required("El stock mínimo es obligatorio"),
    precio:   Yup.number().required("El costo es obligatorio"),
    equipo:   Yup.string().required("El equipo es obligatorio"),
    criticidad: Yup.string().oneOf(["Critico", "Normal"]).required("La criticidad es obligatoria"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = mode === "Edit"
        ? await updateRepuesto(repuesto._id, values)
        : await saveRepuestos(values);
      if (mode === "Edit") updateOk();
      if (response) {
        await Swal.fire({ icon: "success", title: "Operación exitosa", showConfirmButton: false, timer: 1500 });
        resetForm();
        updateRepuestoList();
      }
    } catch (error) { console.log(error); }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      <Form className="flex flex-col gap-4" onKeyDown={handleEnterAsTab}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nombre" className="f-label">Nombre</label>
            <Field type="text" id="nombre" name="nombre" className="f-input" />
            <ErrorMessage name="nombre" component="p" className="f-error" />
          </div>
          <div>
            <label htmlFor="marca" className="f-label">Marca</label>
            <Field type="text" id="marca" name="marca" className="f-input" />
            <ErrorMessage name="marca" component="p" className="f-error" />
          </div>
        </div>
        <div>
          <label htmlFor="tipo" className="f-label">Tipo</label>
          <Field type="text" id="tipo" name="tipo" className="f-input" />
          <ErrorMessage name="tipo" component="p" className="f-error" />
        </div>
        <div>
          <label htmlFor="otras" className="f-label">Otras características</label>
          <Field as="textarea" id="otras" name="otras" rows={3} className="f-input resize-none" />
          <ErrorMessage name="otras" component="p" className="f-error" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="cantidad" className="f-label">Cantidad</label>
            <Field type="number" id="cantidad" name="cantidad" className="f-input" />
            <ErrorMessage name="cantidad" component="p" className="f-error" />
          </div>
          <div>
            <label htmlFor="minStock" className="f-label">Stock mínimo</label>
            <Field type="number" id="minStock" name="minStock" className="f-input" />
            <ErrorMessage name="minStock" component="p" className="f-error" />
          </div>
          <div>
            <label htmlFor="precio" className="f-label">Costo individual</label>
            <Field type="number" id="precio" name="precio" className="f-input" />
            <ErrorMessage name="precio" component="p" className="f-error" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="equipo" className="f-label">Equipo asociado</label>
            <Field as="select" id="equipo" name="equipo" className="f-input">
              <option value="">Selecciona un equipo</option>
              {equipos.map((eq) => (
                <option key={eq._id} value={eq.codigo}>{eq.codigo}</option>
              ))}
            </Field>
            <ErrorMessage name="equipo" component="p" className="f-error" />
          </div>
          <div>
            <label htmlFor="criticidad" className="f-label">Criticidad</label>
            <Field as="select" id="criticidad" name="criticidad" className="f-input">
              <option value="Normal">Normal</option>
              <option value="Critico">Crítico</option>
            </Field>
            <ErrorMessage name="criticidad" component="p" className="f-error" />
          </div>
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

export default FormRepuesto;
