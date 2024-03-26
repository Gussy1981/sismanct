import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import { Table } from 'react-bootstrap';

const CorrectivoOffcanvas = ({ show, handleCloseOffcanvas, repuestoSelect }) => {

  console.log("Desde OffCanvas", repuestoSelect);

  const calcularCostoTotal = () => {
    /*
    Primero, verificamos si repuestoSelect existe y tiene al menos un elemento, y si ese elemento tiene la propiedad id_repuesto. Esto asegura que tenemos datos válidos para trabajar.

    Si las condiciones son verdaderas, procedemos a calcular los costos parciales:

    Usamos el método map() en repuestoSelect para crear un nuevo array llamado costosParciales.
    Dentro de map(), recorremos cada elemento repuesto en repuestoSelect y calculamos el costo parcial 
    multiplicando la cantidad de repuesto por el precio del repuesto 
    (repuesto.cantidad * repuesto.id_repuesto.precio).
    Luego, utilizamos el método reduce() en el array costosParciales para sumar todos los elementos del array. 
    reduce() toma dos argumentos: una función de reducción y un valor inicial. La función de reducción 
    toma dos argumentos, total (el acumulador) y costoParcial (el valor actual), y los suma en cada iteración.

    Finalmente, si no cumplimos las condiciones iniciales (por ejemplo, si repuestoSelect no existe o 
    no tiene datos válidos), simplemente devolvemos 0 como el costo total.
    */
    if (repuestoSelect && repuestoSelect[0] && repuestoSelect[0].id_repuesto) {
      const costosParciales = repuestoSelect.map(repuesto => repuesto.cantidad * repuesto.id_repuesto.precio);
      return costosParciales.reduce((total, costoParcial) => total + costoParcial, 0);
    }
    return 0;
  };

  return (
    <Offcanvas show={show} onHide={handleCloseOffcanvas} placement='end'  className="w-auto bg-slate-700">
      <Offcanvas.Header>
        <button  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={handleCloseOffcanvas}>
          Cerrar
        </button>
        <Offcanvas.Title className=' text-white'>Costos de Mantenimiento</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {repuestoSelect && (
          <div className="pt-4">
          <Table hover variant="dark">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Cantidad</th>
                <th>Precio Individual</th>
                <th>Subtotal</th>
              </tr>
            </thead>  
            <tbody>
            {repuestoSelect.map((repuesto) => (
              <tr key={repuesto._id}>
                <td>{repuesto.id_repuesto.nombre}</td>
                <td>{repuesto.id_repuesto.marca}</td>
                <td>{repuesto.cantidad}</td>
                <td>{repuesto.id_repuesto.precio}</td>
                <td>{repuesto.cantidad * repuesto.id_repuesto.precio}</td>
              </tr>
            ))} 
            </tbody>
            
          </Table>
          <p>Costo Total: {calcularCostoTotal()}</p>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default CorrectivoOffcanvas;