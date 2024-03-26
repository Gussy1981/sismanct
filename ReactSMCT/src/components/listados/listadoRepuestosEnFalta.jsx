import React, { useEffect, useState } from "react";
import { getRepuestoFaltante } from "../configuracion/api";
import FormRepuesto from "../forms/FormRepuestos";
import { Table } from "react-bootstrap";
import { MdShoppingCart } from "react-icons/md";

const listadoRepuestosEnFalta = () => {
  const [enFalta, setEnFalta] = useState([]);
  const [mode, setMode] = useState("");
  const [repuestoToModify, setRepuestoToModify] = useState("");

  const data = async () => {
    try {
      const faltanteData = await getRepuestoFaltante();
      console.log(faltanteData);
      setEnFalta(faltanteData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    data();
  }, []);

  console.log(enFalta);

  const handleChange = (repuesto) => {
    setMode("Edit");
    setRepuestoToModify(repuesto);
  };

  const updateRepuestoList = () => {
    data();
  };

  const updateOk = () => {
    setMode("");
  };
  
  if(enFalta.message === "No hay faltante de repuestos") {
    return (
        <div className="flex justify-center h1 text-cyan-800">
        No hay repuestos críticos en falta
      </div>  
    )
  }
  return (
    <>
      <div className="flex justify-center h1 text-red-800">
        ¡Falta stock en algunos repuestos!
      </div>
      {mode === "Edit" ? (
        <FormRepuesto
          mode={mode}
          repuesto={repuestoToModify}
          updateRepuestoList={updateRepuestoList}
          updateOk={updateOk}
        />
      ) : (
        <div className="pt-4">
          <Table hover variant="dark">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Stock Mínimo</th>
                <th>Ingresar compra</th>
              </tr>
            </thead>
            <tbody>
              {enFalta.repuestosToReturn &&
                enFalta.repuestosToReturn.map((repuesto) => {
                  return (
                    <tr key={repuesto._id}>
                      <td>{repuesto.equipo}</td>
                      <td>{repuesto.nombre}</td>
                      <td>{repuesto.marca}</td>
                      <td>{repuesto.tipo}</td>
                      <td>{repuesto.cantidad}</td>
                      <td>{repuesto.minStock}</td>
                      <td>
                        <button
                          className=" text-yellow-600 font-bold h5"
                          onClick={() => handleChange(repuesto)}
                        >
                          <MdShoppingCart />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default listadoRepuestosEnFalta;
