import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button, Offcanvas } from 'react-bootstrap';
import { updatePiroDone } from '../configuracion/api';
import Swal from 'sweetalert2';

const FormCheckPiro = ({ show, handleClose, piroId, closeForm }) => {
  
  console.log("chequeo ID en OffCanvas:", piroId);
  
  const initialValues = {
    resultado: '',
    vistoBueno: '',
    pirometroPatron: '',
    termocuplaPatron: '',
    observaciones: '',
  };

  const validationSchema = Yup.object().shape({
    resultado: Yup.string().required('El campo Resultado es obligatorio'),
    vistoBueno: Yup.string(),
    pirometroPatron: Yup.string(),
    termocuplaPatron: Yup.string(),
    observaciones: Yup.string().required('El campo Observaciones es obligatorio'),
  });

  const onSubmit = async (values) => {
    // Manejar la lógica de envío del formulario
    try {
      const response = await updatePiroDone(piroId, values);
      if (response.data.status === "Success") {
        await Swal.fire({
          icon: "success",
          title: "Control Verificado!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      handleClose(); // Cerrar el OffCanvas después de enviar el formulario
      closeForm();
    } catch (error) {
      console.log(error);
    }
    
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement='end'  className=" bg-slate-700">
      <Offcanvas.Header>
        <button  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={handleClose}>
          Cerrar
        </button>
        <Offcanvas.Title className=' text-amber-600'>Finalizar Validacion</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Container>
          <Row>
            <Col xs={12}>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ errors, touched }) => (
                  <Form>
                    <Field name="resultado" as="select" className="mb-3 rounded">
                      <option value="" label="Seleccionar Resultado" />
                      <option value="OK">OK</option>
                      <option value="NO_OK">NO OK</option>
                    </Field>
                    {errors.resultado && touched.resultado && (
                      <div className="text-danger">{errors.resultado}</div>
                    )}

                    <Field
                      name="vistoBueno"
                      type="text"
                      placeholder="Visto Bueno"
                      className="mb-3 rounded pl-2"
                    />
                    {errors.vistoBueno && touched.vistoBueno && (
                      <div className="text-danger">{errors.vistoBueno}</div>
                    )}

                    <Field
                      name="pirometroPatron"
                      type="text"
                      placeholder="Pirometro Patron"
                      className="mb-3 rounded pl-2"
                    />
                    {errors.pirometroPatron && touched.pirometroPatron && (
                      <div className="text-danger">{errors.pirometroPatron}</div>
                    )}

                    <Field
                      name="termocuplaPatron"
                      type="text"
                      placeholder="Termocupla Patron"
                      className="mb-3 rounded pl-2"
                    />
                    {errors.termocuplaPatron && touched.termocuplaPatron && (
                      <div className="text-danger">{errors.termocuplaPatron}</div>
                    )}

                    <Field
                      name="observaciones"
                      type="textarea"
                      placeholder="Observaciones"
                      className="mb-3 rounded pl-2"
                    />
                    {errors.observaciones && touched.observaciones && (
                      <div className="text-danger">{errors.observaciones}</div>
                    )}
                    <div>
                    <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                      Guardar
                </Button>
                    </div>
                   
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </Container>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default FormCheckPiro;
