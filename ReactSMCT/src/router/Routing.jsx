import React from "react";
import { Routes, Route, BrowserRouter, Navigate, Link } from "react-router-dom";
import {AuthProvider} from "../context/AuthProvider";
import PublicLayout from "../components/layout/public/PublicLayout";
import Login from "../components/users/Login";
import Home from "../components/layout/public/Home";
import Preventivo from "../components/layout/public/Preventivo";
import TareasByEquipo from "../components/preventivo/TareasByEquipo";
import Correctivo from "../components/layout/public/Correctivo";
import Pirometria from "../components/layout/public/publicPirometria";
import PedidoMant from "../components/layout/public/PedidoMant";
import Usuarios from "../components/layout/admin/Usuarios";
import Equipos from "../components/layout/admin/Equipos";
import Tareas from "../components/layout/admin/Tareas";
import Repuestos from "../components/layout/admin/Repuestos";
import CorrectivoAdmin from "../components/layout/admin/CorrectivoAdmin";
import PreventivoAdmin from "../components/layout/admin/PreventivoAdmin";
import PirometriaAdmin from "../components/layout/admin/PirometriaAdmin";
import AdminHome from "../components/layout/admin/AdminHome";
import Bitacora from "../components/layout/admin/Bitacora";
import CheckPiro from "../components/layout/admin/checkPiro";

const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="preventivo" element={<Preventivo />} />
            <Route path="home" element={<Home />} />
            <Route path="tareasbyequipo/:id" element={<TareasByEquipo/>} />
            <Route path="correctivo" element={<Correctivo/>} />
            <Route path="pirometria" element={<Pirometria/>} />
            <Route path="pedidoMant" element={<PedidoMant/>} />
          </Route>
          <Route path="/admin/" element={<PublicLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="bitacora" element={<Bitacora />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="equipos" element={<Equipos />} />
            <Route path="tareas" element={<Tareas />} />
            <Route path="repuestos" element={<Repuestos/>} />
            <Route path="correctivo" element={<CorrectivoAdmin/>} />
            <Route path="preventivo" element={<PreventivoAdmin/>} />
            <Route path="pirometria" element={<PirometriaAdmin/>} />
            <Route path="checkPiro" element={<CheckPiro/>} />
          </Route>
          <Route
            path="*"
            element={
              <>
                <p>
                  <h1>Error 404</h1>
                  <Link to="/">Volver al Inicio</Link>
                </p>
              </>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routing;
