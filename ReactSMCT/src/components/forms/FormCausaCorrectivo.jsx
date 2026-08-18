import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { handleEnterAsTab } from '../../helpers/formKeyboard';

const FormCausaCorrectivo = () => {
  // Esquema de validaci�n con Yup
  const validationSchema = Yup.object({
    motivo: Yup.string().required('El motivo es obligatorio'),
  });

  // Funci�n para manejar la submisi�n del formulario
  const handleSubmit = (values, { setSubmitting }) => {
    // Aqu� puedes completar con tu l�gica para la petici�n a la API
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
      <Form onKeyDown={handleEnterAsTab}>
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