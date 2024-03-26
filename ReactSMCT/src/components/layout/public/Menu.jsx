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
            <Nav.Link onClick={() => handleSelect('/preventivo')} className=' text-orange-400'>
              PREVENTIVO
            </Nav.Link>
            <Nav.Link onClick={() => handleSelect('/correctivo')} className=' text-orange-400'>
              CORRECTIVO
            </Nav.Link>
            <Nav.Link onClick={() => handleSelect('/pirometria')} className=' text-orange-400'>
              PIROMETRIA
            </Nav.Link>
            <Nav.Link onClick={() => handleSelect('/pedidoMant')} className=' text-orange-400'>
              PEDIDO MANTENIMIENTO
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Menu;
