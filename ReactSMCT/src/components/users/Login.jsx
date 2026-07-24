import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { Global } from "../../helpers/Global";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("El nombre es requerido"),
  dni: Yup.string().required("El DNI es requerido"),
});

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { name: "", dni: "" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(Global.url + "user/login", values);
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        auth.login(user);
        setIsLoggedIn(true);
        resetForm();
        Swal.fire({ title: "Ingreso exitoso", icon: "success", confirmButtonText: "Continuar" });
      } catch (error) {
        console.log(error);
        Swal.fire({ title: "Error", text: "Credenciales incorrectas", icon: "error", confirmButtonText: "Reintentar" });
      }
    },
  });

  useEffect(() => {
    if (auth.user) {
      navigate(auth.user.role === "Empleado" ? "/preventivo" : "/admin/");
    }
  }, [auth.user]);

  useEffect(() => {
    return () => console.log("Login desmontado");
  }, [isLoggedIn]);

  if (isLoggedIn) return null;

  return (
    <div className="absolute z-50 top-0 right-0 mr-4 mt-16">
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl p-6 w-72">
        <h2 className="text-orange-500 font-bold text-sm uppercase tracking-widest mb-5 text-center">
          Iniciar Sesión
        </h2>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="f-label">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Tu nombre de usuario"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={`f-input ${formik.touched.name && formik.errors.name ? "border-red-500" : ""}`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="f-error">{formik.errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="dni" className="f-label">DNI</label>
            <input
              type="password"
              id="dni"
              name="dni"
              placeholder="Tu DNI"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.dni}
              className={`f-input ${formik.touched.dni && formik.errors.dni ? "border-red-500" : ""}`}
            />
            {formik.touched.dni && formik.errors.dni && (
              <p className="f-error">{formik.errors.dni}</p>
            )}
          </div>
          <button type="submit" className="btn-primary w-full mt-1">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
