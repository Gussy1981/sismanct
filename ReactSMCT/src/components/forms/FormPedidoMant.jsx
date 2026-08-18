import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { savePedidos } from "../configuracion/api";
import { handleEnterAsTab } from "../../helpers/formKeyboard";
import ListadoPedidosMant from "../listados/listadoPedidosMant";

const FormPedidoMant = () => {
  const [reloadList, setReloadList] = useState(false);

  const validationSchema = Yup.object().shape({
    solicitante: Yup.string().required("El solicitante es obligatorio"),
    equipo:      Yup.string().required("El equipo es obligatorio"),
    motivo:      Yup.string().required("El motivo es obligatorio"),
    condicion:   Yup.string().oneOf(["Urgente", "Normal"]).required(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await savePedidos(values);
      setReloadList((prev) => !prev);
    } catch (error) { console.log(error); }
    resetForm();
  };

  return (
    <div className="pt-4 pb-4">
      <h1 className="text-center text-lg font-bold text-orange-400 uppercase tracking-wide pt-2 pb-4">
        Pedidos de Mantenimiento
      </h1>
      <Formik
        initialValues={{ solicitante: "", equipo: "", motivo: "", condicion: "Normal" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col gap-4 max-w-2xl mx-auto" onKeyDown={handleEnterAsTab}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="solicitante" className="f-label">Solicitante</label>
                <Field
                  type="text" id="solicitante" name="solicitante"
                  className={`f-input ${errors.solicitante && touched.solicitante ? "border-red-500" : ""}`}
                />
                {errors.solicitante && touched.solicitante && <p className="f-error">{errors.solicitante}</p>}
              </div>
              <div>
                <label htmlFor="equipo" className="f-label">Equipo</label>
                <Field
                  type="text" id="equipo" name="equipo"
                  className={`f-input ${errors.equipo && touched.equipo ? "border-red-500" : ""}`}
                />
                {errors.equipo && touched.equipo && <p className="f-error">{errors.equipo}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="motivo" className="f-label">Motivo</label>
                <Field
                  type="text" id="motivo" name="motivo"
                  className={`f-input ${errors.motivo && touched.motivo ? "border-red-500" : ""}`}
                />
                {errors.motivo && touched.motivo && <p className="f-error">{errors.motivo}</p>}
              </div>
              <div>
                <label htmlFor="condicion" className="f-label">Condición</label>
                <Field as="select" id="condicion" name="condicion" className="f-input">
                  <option value="Normal">Normal</option>
                  <option value="Urgente">Urgente</option>
                </Field>
              </div>
            </div>
            <div>
              <button type="submit" className="btn-primary">Enviar pedido</button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="pt-6">
        <ListadoPedidosMant key={reloadList} />
      </div>
    </div>
  );
};

export default FormPedidoMant;
