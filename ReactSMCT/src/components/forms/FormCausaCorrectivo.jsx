import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const FormCausaCorrectivo = () => {
  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    motivo: Yup.string().required('El motivo es obligatorio'),
  });

  // Función para manejar la submisión del formulario
  const handleSubmit = (values, { setSubmitting }) => {
    // Aquí puedes completar con tu lógica para la petición a la API
    console.log(values); // Valores del formulario
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        motivo: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <div>
          <label htmlFor="motivo">Motivo</label>
          <Field type="text" id="motivo" name="motivo" />
          <ErrorMessage name="motivo" component="div" />
        </div>
        <button type="submit">Guardar</button>
      </Form>
    </Formik>
  );
};

export default FormCausaCorrectivo;