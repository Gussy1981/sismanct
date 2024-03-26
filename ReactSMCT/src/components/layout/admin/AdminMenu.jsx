import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const navigate = useNavigate();

  const handleSelect = (path) => {
    navigate(path);
  };

  return (
    <>
      <Navbar variant="dark" expand="lg" className=' bg-sky-800'>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={() => handleSelect('/admin/')} className=' text-orange-400' >
              PANEL PRINCIPAL
            </Nav.Link>
            <Nav.Link onClick={() => handleSelect('/admin/bitacora')} className=" text-orange-400">
              BITACORA DE MANTENIMIENTO
            </Nav.Link>
            <Nav.Link onClick={() => handleSelect('/admin/usuarios')} className=" text-orange-400">
              USUARIOS
            </Nav.Link>
            <Nav.Link onClick={() => handleSelect('/admin/equipos')} className=" text-orange-400">
              EQUIPOS
            </Nav.Link>
            <Nav.Link onClick={() => handleSelect('/admin/tareas')} className=" text-orange-400">
              TAREAS
            </Nav.Link>
            <Nav.Link onClick={() => handleSelect('/admin/repuestos')} className=" text-orange-400">
              REPUESTOS
            </Nav.Link>
            <Nav.Link onClick={() => handleSelect('/admin/preventivo')} className=" text-orange-400">
              PREVENTIVO
            </Nav.Link>
            <Nav.Link onClick={() => handleSelect('/admin/correctivo')} className=" text-orange-400">
              CORRECTIVO
            </Nav.Link>
            <Nav.Link onClick={() => handleSelect('/admin/pirometria')} className=" text-orange-400">
              PIROMETRIA
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Menu;
