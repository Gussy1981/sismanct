import React, { useEffect, useState } from "react";
import { getPiroInit } from "../../configuracion/api";
import { Table } from "react-bootstrap";
import FormCumplirPirometria from "../../forms/FormCumplirPirometria";

const Pirometria = () => {
  const [listado, setListado] = useState([]);
  const [mode, setMode] = useState("");
  const [itemToModify, setItemToModify] = useState([]);

  const data = async () => {
    const piroData = await getPiroInit();
    console.log(piroData.pirometriasToReturn);
    setListado(piroData.pirometriasToReturn);
  };

  useEffect(() => {
    data();
  }, []);

  console.log("Pirometrias iniciadas", listado);

  const handleClick = (imtem) => {
    console.log(imtem);
    setItemToModify(imtem);
    setMode("Edit");
  };

  const updateOk = () => {
    setMode("");
  };

  const updateListAfterSave = () => {
    data();
  };

  if (listado.length > 0) {
    return (
      <>
        {mode === "Edit" ? (
          <FormCumplirPirometria
            mode={mode}
            initialValues={itemToModify}
            updateOk={updateOk}
            updateListAfterSave={updateListAfterSave}
          />
        ) : (
          <div className="pt-4">
            <Table hover variant="dark">
              <thead>
                <tr>
                  <td>Equipo</td>
                  <td>Rango Temperatura</td>
                  <td>Responsable</td>
                  <td>Cumplir Control</td>
                </tr>
              </thead>
              <tbody>
                {listado &&
                  listado.map((item) => {
                    return (
                      <tr key={item._id}>
                        <td>{item.equipo}</td>
                        <td>{item.temperatura}</td>
                        <td>{item.responsable}</td>
                        <td>
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white font-bold rounded py-2 px-4"
                            onClick={() => handleClick(item)}
                          >
                            Cumplir
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
  } else {
    return (
      <>
        <div className="flex justify-center">
          <div className=" text-center h1 text-cyan-900 pt-5">
            No hay controles por hacer
          </div>
        </div>
      </>
    );
  }
};

export default Pirometria;
