import React, { useState } from "react";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, FormGroup, Button } from 'react-bootstrap';
import { savePedidos } from '../configuracion/api';
import ListadoPedidosMant from '../listados/listadoPedidosMant';

const FormPedidoMant = () => {

  const [reloadList, setReloadList] = useState(false);

  // Define el esquema de validación utilizando Yup
  const validationSchema = Yup.object().shape({
    solicitante: Yup.string().required('El solicitante es obligatorio'),
    equipo: Yup.string().required('El equipo es obligatorio'),
    motivo: Yup.string().required('El motivo es obligatorio'),
    condicion: Yup.string().oneOf(['Urgente', 'Normal']).required('La condición es obligatoria'),
  });

  // Función para manejar el envío del formulario
  const handleSubmit = async (values, { resetForm }) => {
    // Aquí enviamos los datos del formulario al servidor
    try{
      let response = await savePedidos(values);
      console.log(response);
      setReloadList(true);
    } catch (error) {
      console.log(error);
    } 
    resetForm();
  };

  // Valores iniciales del formulario
  const initialValues = {
    solicitante: '',
    equipo: '',
    motivo: '',
    condicion: 'Normal',
  };

  return (
    <>
    <div className="pt-4 justify-center h-screen pb-2">
          <h1 className="text-center h4 pt-2 pb-3">Pedidos de Mantenimiento</h1>
    
    <Container>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Row>
              <Col>
                <FormGroup>
                  <label htmlFor="solicitante">Solicitante</label>
                  <Field
                    type="text"
                    id="solicitante"
                    name="solicitante"
                    className={`form-control ${errors.solicitante && touched.solicitante ? 'is-invalid' : ''}`}
                  />
                  {errors.solicitante && touched.solicitante && (
                    <div className="invalid-feedback">{errors.solicitante}</div>
                  )}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label htmlFor="equipo">Equipo</label>
                  <Field
                    type="text"
                    id="equipo"
                    name="equipo"
                    className={`form-control ${errors.equipo && touched.equipo ? 'is-invalid' : ''}`}
                  />
                  {errors.equipo && touched.equipo && (
                    <div className="invalid-feedback">{errors.equipo}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <label htmlFor="motivo">Motivo</label>
                  <Field
                    type="text"
                    id="motivo"
                    name="motivo"
                    className={`form-control ${errors.motivo && touched.motivo ? 'is-invalid' : ''}`}
                  />
                  {errors.motivo && touched.motivo && (
                    <div className="invalid-feedback">{errors.motivo}</div>
                  )}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label htmlFor="condicion">Condición</label>
                  <Field
                    as="select"
                    id="condicion"
                    name="condicion"
                    className={`form-control ${errors.condicion && touched.condicion ? 'is-invalid' : ''}`}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgente">Urgente</option>
                  </Field>
                  {errors.condicion && touched.condicion && (
                    <div className="invalid-feedback">{errors.condicion}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <div className='pt-2'>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Enviar
            </button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
    <div className="pt-4">
    <ListadoPedidosMant key={reloadList} />
    </div>
    </div>
    </>

  );
};

export default FormPedidoMant;
