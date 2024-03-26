import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { Global } from "../../helpers/Global";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Ingrese su nombre"),
  dni: Yup.string().required("Ingrese su DNI"),
});

const Login = () => {

  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  const auth = useAuth();
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      dni: "",
    },
    validationSchema,
    
    onSubmit: async (values, { resetForm }) => {
      
      try {
        const response = await axios.post(Global.url + "user/login", values);
        console.log(response);
          const { token, user } = response.data;
          
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          const newUser = user;
          auth.login(newUser);
          setIsLoggedIn(true);

          resetForm();
          Swal.fire({
            title: 'Ingreso exitoso!',
            text: 'Has ingresado correctamente',
            icon: 'success',
            confirmButtonText: 'Continuar'});
            
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error en la autenticación',
          icon: 'error',
          confirmButtonText: 'Volver a intentar',
        })
      }
        
    },

  });

  useEffect(() => {
    if (auth.user) {
      if(auth.user.role === "Empleado") {
        navigate("/preventivo");
      } else if (auth.user.role === "Administrador") {
        navigate("/admin/");
      }
    }
  }, [auth.user]);

  useEffect(() => {
    return () => {
      console.log("El login será desmontado");
    };
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return null; // Retorna null para desmontar el componente
  };
   

  return (
    <div className="absolute z-50 top-0 right-0 mr-4 mt-16 bg-gray-800 p-4 min-h-300 rounded-md shadow-md">
      <div className="justify-center items-center min-h-0 bg-gray-500">
        <div className="bg-white p-8 rounded-md border-2 border-gray-400">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-bold mb-2"
              >
                NOMBRE
              </label>
              <input
                type="text"
                placeholder="Ingresa tu Nombre"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className={`border rounded-md px-4 py-2 ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : ""
                } text-black`}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500">{formik.errors.name}</div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="dni"
                className="block text-gray-700 font-bold mb-2"
              >
                DNI
              </label>
              <input
                type="dni"
                placeholder="Ingresa tu DNI"
                name="dni"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
                value={formik.values.dni}
                className={`border rounded-md px-4 py-2 ${
                  formik.touched.dni && formik.errors.dni
                    ? "border-red-500"
                    : ""
                } text-black`}
              />
              {formik.touched.dni && formik.errors.dni && (
                <div className="text-red-500">{formik.errors.dni}</div>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
