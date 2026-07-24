import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Offcanvas } from "react-bootstrap";
import { updatePiroDone } from "../configuracion/api";
import Swal from "sweetalert2";

const FormCheckPiro = ({ show, handleClose, piroId, closeForm }) => {
  const initialValues = {
    resultado:       "",
    vistoBueno:      "",
    pirometroPatron: "",
    termocuplaPatron:"",
    observaciones:   "",
  };

  const validationSchema = Yup.object().shape({
    resultado:     Yup.string().required("El resultado es obligatorio"),
    observaciones: Yup.string().required("Las observaciones son obligatorias"),
  });

  const onSubmit = async (values) => {
    try {
      const response = await updatePiroDone(piroId, values);
      if (response.data.status === "Success") {
        await Swal.fire({ icon: "success", title: "Control verificado", showConfirmButton: false, timer: 1500 });
      }
      handleClose();
      closeForm();
    } catch (error) { console.log(error); }
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" className="bg-zinc-800">
      <Offcanvas.Header className="border-b border-zinc-700">
        <button onClick={handleClose} className="btn-danger text-xs">Cerrar</button>
        <Offcanvas.Title className="text-orange-400 font-bold uppercase tracking-wide text-sm ml-3">
          Finalizar Validación
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-4 pt-2">
              <div>
                <label className="f-label">Resultado</label>
                <Field as="select" name="resultado" className="f-input">
                  <option value="">Seleccionar resultado</option>
                  <option value="OK">OK</option>
                  <option value="NO_OK">NO OK</option>
                </Field>
                {errors.resultado && touched.resultado && (
                  <p className="f-error">{errors.resultado}</p>
                )}
              </div>

              <div>
                <label className="f-label">Visto bueno</label>
                <Field type="text" name="vistoBueno" placeholder="Nombre" className="f-input" />
              </div>

              <div>
                <label className="f-label">Pirómetro patrón</label>
                <Field type="text" name="pirometroPatron" placeholder="Modelo / N° serie" className="f-input" />
              </div>

              <div>
                <label className="f-label">Termocupla patrón</label>
                <Field type="text" name="termocuplaPatron" placeholder="Modelo / N° serie" className="f-input" />
              </div>

              <div>
                <label className="f-label">Observaciones</label>
                <Field as="textarea" name="observaciones" rows={4} placeholder="Observaciones del control" className="f-input resize-none" />
                {errors.observaciones && touched.observaciones && (
                  <p className="f-error">{errors.observaciones}</p>
                )}
              </div>

              <button type="submit" className="btn-success w-full">
                Guardar validación
              </button>
            </Form>
          )}
        </Formik>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default FormCheckPiro;
