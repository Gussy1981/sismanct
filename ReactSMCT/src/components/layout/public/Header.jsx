import React, { useState } from "react";
import logo from "../../../../public/logo cementa grande.fw.png"
import logo2 from "../../../../public/Logo sismanct.fw.png"
import useAuth from "../../../hooks/useAuth";
import Login from "../../users/Login";
import { useNavigate } from "react-router-dom";

const Header = () => {

  const [ showLogin, setShowLogin] = useState(false);
  const auth = useAuth();
  console.log("Estado de Login: " + showLogin);
  console.log("Info del usuario:" + auth.user);

  const navigate = useNavigate();


  const handleButtonClick = () => {
    setShowLogin(true);
  };

  const handleLogout = () => {
    setShowLogin(false);
    auth.logout();
    navigate("/")
  };

  return (
    <div>
      <div className="grid grid-cols-3 bg-black text-white">
      <div className="p-4"><img src={logo} alt="Logo" className="w-20 h-auto"/> </div>
      <div className="p-4 text-center">
        <img src={logo2} alt="Logo SMCT" className="w-40 h-auto"/>
      </div>
      <div className="p-4 flex justify-end items-center">
        {auth.user ? (
          <div className="flex items-center">
            <h1 className="mr-4">Bienvenido, {auth.user.name}!</h1>
            <button 
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleLogout}
            >
              Salir
            </button>
          </div>
        ) : (
        <button className="absolute top-0 right-0 mr-4 mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={handleButtonClick}>Ingresar</button>
      )}
        {showLogin && <Login />}
      </div>
      </div>
</div>
  )
};

export default Header;
