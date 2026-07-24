import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { saveEquipos, updateEquipo, updateImage } from "../configuracion/api";

const FormEquipos = ({ mode, equipo, updateEquipoList, updateOk }) => {
  const initialValues = {
    clasificacion:               mode === "Edit" ? equipo?.clasificacion               ?? "Maquina" : "Maquina",
    codigo:                      mode === "Edit" ? equipo?.codigo                      ?? "" : "",
    tipo:                        mode === "Edit" ? equipo?.tipo                        ?? "" : "",
    temperaturaDeTrabajo:        mode === "Edit" ? equipo?.temperaturaDeTrabajo        ?? "" : "",
    urlImagen:                   mode === "Edit" ? equipo?.urlImagen                   ?? "" : "",
    caracteristicasDeCalentamiento: mode === "Edit" ? equipo?.caracteristicasDeCalentamiento ?? "" : "",
  };

  const validationSchema = Yup.object({
    clasificacion:               Yup.string().required("La clasificación es obligatoria"),
    codigo:                      Yup.string().required("El código es obligatorio"),
    tipo:                        Yup.string().required("El tipo es obligatorio"),
    temperaturaDeTrabajo:        Yup.string().required("La temperatura de trabajo es obligatoria. Ej: 100-800"),
    caracteristicasDeCalentamiento: Yup.string().required("Las características son requeridas"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      let response;
      if (mode === "Edit") {
        const fileInput = document.querySelector("#file");
        if (fileInput?.files[0]) {
          const formData = new FormData();
          formData.append("file0", fileInput.files[0]);
          const imageResponse = await updateImage(formData, equipo._id);
          if (imageResponse.status === "Success") {
            response = await updateEquipo(equipo._id, { ...values, urlImagen: imageResponse.url });
            updateOk();
          }
        } else {
          response = await updateEquipo(equipo._id, values);
          updateOk();
        }
      } else {
        response = await saveEquipos(values);
      }
      if (response?.status === "Success") {
        await Swal.fire({ icon: "success", title: "Operación exitosa", showConfirmButton: false, timer: 1500 });
        resetForm();
        updateEquipoList();
      }
    } catch (error) { console.log(error); }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ setFieldValue }) => (
        <Form encType="multipart/form-data" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="clasificacion" className="f-label">Clasificación</label>
              <Field as="select" id="clasificacion" name="clasificacion" className="f-input">
                <option value="Maquina">Máquina</option>
                <option value="Infraestructura">Infraestructura</option>
              </Field>
              <ErrorMessage name="clasificacion" component="p" className="f-error" />
            </div>
            <div>
              <label htmlFor="codigo" className="f-label">Código</label>
              <Field type="text" id="codigo" name="codigo" className="f-input" />
              <ErrorMessage name="codigo" component="p" className="f-error" />
            </div>
          </div>
          <div>
            <label htmlFor="tipo" className="f-label">Tipo</label>
            <Field type="text" id="tipo" name="tipo" className="f-input" />
            <ErrorMessage name="tipo" component="p" className="f-error" />
          </div>
          <div>
            <label htmlFor="temperaturaDeTrabajo" className="f-label">Temperatura de trabajo</label>
            <Field type="text" id="temperaturaDeTrabajo" name="temperaturaDeTrabajo" className="f-input" placeholder="Ej: 100-800" />
            <ErrorMessage name="temperaturaDeTrabajo" component="p" className="f-error" />
          </div>
          <div>
            <label htmlFor="caracteristicasDeCalentamiento" className="f-label">Características de calentamiento</label>
            <Field as="textarea" id="caracteristicasDeCalentamiento" name="caracteristicasDeCalentamiento" rows={3} className="f-input resize-none" />
            <ErrorMessage name="caracteristicasDeCalentamiento" component="p" className="f-error" />
          </div>
          <div>
            <label className="f-label">Imagen / Esquema</label>
            <input
              type="file"
              id="file"
              name="file0"
              accept="image/*"
              onChange={(e) => setFieldValue("file0", e.currentTarget.files[0])}
              className="block text-sm text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 file:cursor-pointer"
            />
          </div>
          <div>
            <button type="submit" className="btn-primary">
              {mode === "Edit" ? "Modificar" : "Guardar"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormEquipos;
