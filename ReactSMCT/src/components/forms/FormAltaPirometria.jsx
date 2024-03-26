import React, { useState, useMemo } from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import { savePirometria, updatePirometria } from "../configuracion/api";
import Swal from "sweetalert2";
import * as Yup from "yup";
import FormCheckPiro from "./FormCheckPiro";
import { useNavigate } from "react-router-dom";

// Define el esquema de validación con Yup
const validationSchema = Yup.object().shape({
  numColumnas: Yup.number()
    .min(1, "Debe haber al menos una columna")
    .required("Campo obligatorio"),
  numFilas: Yup.number()
    .min(1, "Debe haber al menos una fila")
    .required("Campo obligatorio"),
  columnas: Yup.object().shape({}),
  equipo: Yup.string().required("Debe ingresar un codigo de equipo"),
  temperatura: Yup.string().required(
    "Debe ingresar el rango de temperatura de trabajo Ej: 100-800"
  ),
  responsable: Yup.string().required("Debe ingresar un responsable"),
});

const FormAltaPirometria = ({
  mode,
  pirometria,
  updatePiroList,
  updateOk,
  check,
  idPiro,
}) => {
  const [show, setShow] = useState(true);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [piroId, setPiroId] = useState("");
  console.log("chequeo ID:", idPiro);

  const initialValues = useMemo(() => {
    const initialVals = {
      numColumnas: 0,
      numFilas: 0,
      columnas: {},
      equipo: "",
      temperatura: "",
      responsable: "",
    };

    if (mode === "Edit" && pirometria) {
      initialVals.numColumnas = pirometria.numColumnas;
      initialVals.numFilas = pirometria.numColumnas;
      initialVals.columnas = pirometria.columnas;
      initialVals.equipo = pirometria.equipo;
      initialVals.temperatura = pirometria.temperatura;
      initialVals.responsable = pirometria.responsable;
      setShow(false);
      setPiroId(idPiro);
      console.log("Si estoy en Edit y pirometria", check);
    }

    return initialVals;
  }, [mode, pirometria]);

  const navigate = useNavigate();

  const handleSubmit = async (values, { resetForm }) => {
    try {
      let response;

      if (mode === "Edit") {
        response = await updatePirometria(pirometria._id, values);

        if (response.data.status === "Success") {
          await Swal.fire({
            icon: "success",
            title: "Se modifico el registro",
            showConfirmButton: false,
            timer: 1500,
          });
          resetForm();
          updateOk();
          updatePiroList();
        } else {
          if (response.status === "Error") {
            await Swal.fire({
              icon: "error",
              title: "No se pudo modificar el registro",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }
      } else {
        response = await savePirometria(values);
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
        setShow(true);
        updatePiroList();
      } else {
        if (response.status === "Error") {
          await Swal.fire({
            icon: "error",
            title: "No se pudo guardar el registro",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheck = () => {
    console.log("Hola");
    setShowOffcanvas(true);
  };
  const handleCloseOffcanvas = () => {
    setShowOffcanvas(false);
  };
  const closeForm = () => {
    navigate("/admin/pirometria")
  }
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={!show && !check ? handleSubmit : undefined}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="flex items-center justify-center">
              {show ? (
                <div className="flex flex-row">
                  <div className="mb-3">
                    <label htmlFor="numColumnas">
                      Ingrese número de columnas:
                    </label>
                    <Field
                      type="number"
                      id="numColumnas"
                      name="numColumnas"
                      className="form-control w-20"
                    />
                  </div>
                  <div className="mb-3 px-10">
                    <label htmlFor="numFilas">Ingrese número de filas:</label>
                    <Field
                      type="number"
                      id="numFilas"
                      name="numFilas"
                      className="form-control w-20"
                    />
                  </div>
                  <button
                    className="w-20 h-10 bg-blue-600 rounded-lg hover:bg-blue-700"
                    onClick={() => {
                      const numColumnas = values.numColumnas;
                      const numFilas = values.numFilas;
                      const newColumnas = {};
                      for (let i = 1; i <= numColumnas; i++) {
                        newColumnas[`Columna_${i}`] = Array(numFilas).fill("");
                      }
                      setFieldValue("columnas", newColumnas);
                      setShow(false);
                    }}
                  >
                    Aplicar
                  </button>
                </div>
              ) : (
                <div className="flex items-start pl-5">
                  <div className="mb-3 w-[20%]">
                    <label htmlFor="equipo">Equipo</label>
                    <Field
                      type="text"
                      id="equipo"
                      name="equipo"
                      autoComplete="off"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="equipo"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3 pl-10">
                    <label htmlFor="temperatura">Temperatura de trabajo</label>
                    <Field
                      type="text"
                      id="temperatura"
                      name="temperatura"
                      autoComplete="off"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="temperatura"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3 pl-10 w-[50%]">
                    <label htmlFor="responsable">Responsable</label>
                    <Field
                      type="text"
                      id="responsable"
                      name="responsable"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="responsable"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>
              )}
            </div>
            {!show && (
              <div className="flex justify-center">
                <FieldArray
                  name="columnas"
                  render={(arrayHelpers) => (
                    <div className="flex">
                      {Object.keys(values.columnas).map(
                        (nombreColumna, columnIndex) => (
                          <div
                            key={nombreColumna}
                            className="flex-shrink-0 w-20"
                          >
                            <div className="mb-3">
                              {/*<label>{nombreColumna}</label>*/}
                              {values.columnas[nombreColumna].map(
                                (fila, rowIndex) => (
                                  <Field
                                    key={rowIndex}
                                    type="text"
                                    name={`columnas.${nombreColumna}[${rowIndex}]`}
                                    className="form-control text-sm text-center"
                                  />
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                />
              </div>
            )}
            {!show && !check ? (
              <div className="flex justify-center ">
                <div className="space-x-4 pb-4">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                    onClick={() => setShow(true)}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                    {mode === "Edit" ? "Modificar" : "Guardar"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center ">
                <div className="space-x-4 pb-4">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleCheck()}
                  >
                    Validar
                  </button>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
      <FormCheckPiro
        show={showOffcanvas}
        handleClose={handleCloseOffcanvas}
        piroId={piroId}
        closeForm={closeForm}
      />
    </>
  );
};

export default FormAltaPirometria;
