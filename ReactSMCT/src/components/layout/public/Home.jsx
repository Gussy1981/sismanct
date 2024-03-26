import React, { useState, useEffect } from 'react'
import Preventivo from '../public/Preventivo';
import Login from '../../users/Login';
import Swal from 'sweetalert2';
import Icon from "../../../../public/Logo sismanct.fw.png";
import '../../../../../ReactSMCT/src/App.css';

const Home = () => {

    
    const [ loadHome, setLoadHome ] = useState (false);
    const [ showWelcomeAlert, setShowWelcomAlert ] = useState (true); 

    localStorage.clear();

    useEffect(() => {
      Swal.fire({
        background: '#ffe599',
        title: 'Bienvenido',
        text: 'Sistema de Mantenimiento Industrial',
        iconHtml: `<img src="${Icon}" />`,
        timer: '4000',
        showConfirmButton: false,
        customClass: {
          icon: 'my-icon-class'
        }
      }).then(() =>{
          setShowWelcomAlert(false);
          setLoadHome(true);
      });
    }, []);

  return (
    <>
      {loadHome && <Preventivo />}
      {showWelcomeAlert}
    </>
  )
}

export default Home