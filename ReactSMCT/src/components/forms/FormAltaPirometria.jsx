import { useState, useMemo } from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import { savePirometria, updatePirometria } from "../configuracion/api";
import { handleEnterAsTab } from "../../helpers/formKeyboard";
import Swal from "sweetalert2";
import * as Yup from "yup";
import FormCheckPiro from "./FormCheckPiro";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  numColumnas: Yup.number().min(1).required("Campo obligatorio"),
  numFilas:    Yup.number().min(1).required("Campo obligatorio"),
  columnas:    Yup.object().shape({}),
  equipo:      Yup.string().required("Ingrese un código de equipo"),
  temperatura: Yup.string().required("Ingrese el rango de temperatura. Ej: 100-800"),
  responsable: Yup.string().required("Ingrese un responsable"),
});

const FormAltaPirometria = ({ mode, pirometria, updatePiroList, updateOk, check, idPiro }) => {
  const [show,           setShow]           = useState(true);
  const [showOffcanvas,  setShowOffcanvas]   = useState(false);
  const [piroId,         setPiroId]         = useState("");
  const navigate = useNavigate();

  const initialValues = useMemo(() => {
    const vals = { numColumnas: 0, numFilas: 0, columnas: {}, equipo: "", temperatura: "", responsable: "" };
    if (mode === "Edit" && pirometria) {
      vals.numColumnas = pirometria.numColumnas;
      vals.numFilas    = pirometria.numColumnas;
      vals.columnas    = pirometria.columnas;
      vals.equipo      = pirometria.equipo;
      vals.temperatura = pirometria.temperatura;
      vals.responsable = pirometria.responsable;
      setShow(false);
      setPiroId(idPiro);
    }
    return vals;
  }, [mode, pirometria]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      let response;
      if (mode === "Edit") {
        response = await updatePirometria(pirometria._id, values);
        if (response.data.status === "Success") {
          await Swal.fire({ icon: "success", title: "Registro modificado", showConfirmButton: false, timer: 1500 });
          resetForm(); updateOk(); updatePiroList();
        }
      } else {
        response = await savePirometria(values);
        if (response.status === "Success") {
          await Swal.fire({ icon: "success", title: "Operación exitosa", showConfirmButton: false, timer: 1500 });
          resetForm(); setShow(true); updatePiroList();
        }
      }
    } catch (error) { console.log(error); }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={!show && !check ? handleSubmit : undefined}
      >
        {({ values, setFieldValue }) => (
          <Form onKeyDown={handleEnterAsTab}>
            <div className="flex items-center justify-center py-4">
              {show ? (
                /* ── Paso 1: definir dimensiones ── */
                <div className="flex flex-wrap items-end gap-6">
                  <div>
                    <label className="f-label">Número de columnas</label>
                    <Field type="number" name="numColumnas"
                      className="f-input w-24 text-center" />
                  </div>
                  <div>
                    <label className="f-label">Número de filas</label>
                    <Field type="number" name="numFilas"
                      className="f-input w-24 text-center" />
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      const cols = {};
                      for (let i = 1; i <= values.numColumnas; i++) {
                        cols[`Columna_${i}`] = Array(values.numFilas).fill("");
                      }
                      setFieldValue("columnas", cols);
                      setShow(false);
                    }}
                  >
                    Aplicar
                  </button>
                </div>
              ) : (
                /* ── Paso 2: datos del equipo ── */
                <div className="flex flex-wrap items-end gap-6">
                  <div className="w-36">
                    <label className="f-label">Equipo</label>
                    <Field type="text" name="equipo" autoComplete="off" className="f-input" />
                    <ErrorMessage name="equipo" component="p" className="f-error" />
                  </div>
                  <div className="w-44">
                    <label className="f-label">Temperatura de trabajo</label>
                    <Field type="text" name="temperatura" autoComplete="off" className="f-input" />
                    <ErrorMessage name="temperatura" component="p" className="f-error" />
                  </div>
                  <div className="w-52">
                    <label className="f-label">Responsable</label>
                    <Field type="text" name="responsable" className="f-input" />
                    <ErrorMessage name="responsable" component="p" className="f-error" />
                  </div>
                </div>
              )}
            </div>

            {/* ── Grilla de temperatura ── */}
            {!show && (
              <div className="flex justify-center py-2">
                <FieldArray name="columnas">
                  {() => (
                    <div className="flex gap-1">
                      {Object.keys(values.columnas).map((colName) => (
                        <div key={colName} className="flex flex-col gap-1 w-16">
                          {values.columnas[colName].map((_, rowIndex) => (
                            <Field
                              key={rowIndex}
                              type="text"
                              name={`columnas.${colName}[${rowIndex}]`}
                              className="w-full bg-zinc-700 border border-zinc-600 text-zinc-100 rounded px-1 py-1 text-xs text-center focus:outline-none focus:border-orange-500 transition-colors"
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </FieldArray>
              </div>
            )}

            {/* ── Botones de acción ── */}
            {!show && (
              <div className="flex justify-center gap-3 py-4">
                {!check ? (
                  <>
                    <button type="button" onClick={() => setShow(true)} className="btn-secondary">
                      Reset
                    </button>
                    <button type="submit" className="btn-success">
                      {mode === "Edit" ? "Modificar" : "Guardar"}
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => setShowOffcanvas(true)} className="btn-primary">
                    Validar
                  </button>
                )}
              </div>
            )}
          </Form>
        )}
      </Formik>

      <FormCheckPiro
        show={showOffcanvas}
        handleClose={() => setShowOffcanvas(false)}
        piroId={piroId}
        closeForm={() => navigate("/admin/pirometria")}
      />
    </>
  );
};

export default FormAltaPirometria;
