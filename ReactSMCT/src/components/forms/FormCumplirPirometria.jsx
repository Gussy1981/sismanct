import React from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import { savePirometriaDone } from "../configuracion/api";
import Swal from "sweetalert2";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  numColumnas: Yup.number()
    .min(1, "Debe haber al menos una columna")
    .required("Campo obligatorio"),
  numFilas: Yup.number()
    .min(1, "Debe haber al menos una fila")
    .required("Campo obligatorio"),
  columnas: Yup.object().shape({}),
  equipo: Yup.string().required("Campo obligatorio"),
  temperatura: Yup.string().required("Campo obligatorio"),
  responsable: Yup.string().required("Campo obligatorio"),
});

const FormEdicionPirometria = ({ mode, initialValues, updateOk, updateListAfterSave }) => {

    console.log("datos recibidos", initialValues);

    const handleSubmit = async(values, {resetForm}) => {
        try{
            const response = await savePirometriaDone(values);
            console.log(response);

            if (response.status === "Success") {
                await Swal.fire({
                  icon: "success",
                  title: "Registro de pirometria guardado",
                  showConfirmButton: false,
                  timer: 1500,
                });
                resetForm();
                updateOk();
                updateListAfterSave();
              } else {
                if (response.status === "Error") {
                  await Swal.fire({
                    icon: "error",
                    title: "No se pudo guardar el registro",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                };
              }; 
        } catch(error) {
            console.log(error);
        }
    }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form>
          <div className="flex items-center justify-center h1 space-x-10 text-cyan-800">
            <p>Equipo: {initialValues.equipo}</p>
            <p>Rango de temperatura: {initialValues.temperatura}</p>
          </div>
          <div className="flex justify-center">
            <FieldArray
              name="columnas"
              render={(arrayHelpers) => (
                <div className={`flex flex-cols-${values.numColumnas} p-2`}>
                  {Object.keys(values.columnas).map((nombreColumna) => (
                    <div key={nombreColumna} className="flex-shrink-0 w-20">
                      <div className="mb-3">
                        {values.columnas[nombreColumna].map((fila, rowIndex) => (
                          <Field
                            key={rowIndex}
                            type="text"
                            name={`columnas.${nombreColumna}[${rowIndex}]`}
                            className="form-control text-sm text-center"
                            readOnly={initialValues.columnas[nombreColumna][rowIndex] !== ""} // Establece como solo lectura si el campo ya tiene información
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Guardar
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormEdicionPirometria;
