import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MdOutlineFactCheck } from "react-icons/md";
import { Table } from "react-bootstrap";
import { DateTime } from "luxon";
import FormAltaPirometria from "../../forms/FormAltaPirometria";

const checkPiro = () => {
  const location = useLocation();
  if (location.state) {
    console.log(location.state.piroDone);

    const [checkRecords, setCheckRecords] = useState([]);
    const [ mode, setMode ] = useState("");
    const [ piroToCheck, setPiroToCheck ] = useState("");
    const [ check, setCheck ] = useState(false);
    const [ idPiro, setIdPiro ] = useState("");

    const stateSetter = () => {
      if (location.state.piroDone) {
        setCheckRecords(location.state.piroDone);
      } else {
        setCheckRecords([]);
      }
    };

    useEffect(() => {
      stateSetter();
    }, []);

    const handleCheck = (item) =>{
        console.log(item);
        setMode("Edit");
        setPiroToCheck(item);
        setCheck(true);
        setIdPiro(item._id);
    }

    console.log("Verifico Estado de checkPiro:", checkRecords);

    return (
      <>
        <div className="flex justify-center items-center text-center h4 py-4">
          Registros de Pirometria para Verificar
        </div>
        {mode === "Edit" ? (
        <FormAltaPirometria
          mode={mode}
          pirometria={piroToCheck}
          check={check}
          idPiro={idPiro}
          //updatePiroList={updatePiroList}
          //updateOk={updateOk}
        />
      ) : (
        <Table hover variant="dark">
          <thead>
            <tr>
              <td>Equipo</td>
              <td>Fecha</td>
              <td>Responsable</td>
              <td> Verificar </td>
              
            </tr>
          </thead>
          <tbody>
            {checkRecords &&
              checkRecords.map((item) => {
                const fechaFormateada = DateTime.fromISO(
                  item.fechaControl
                ).toFormat("dd-MM-yyyy");
                return (
                  <tr key={item._id}>
                    <td>{item.equipo}</td>
                    <td>{fechaFormateada}</td>
                    <td>{item.responsable}</td>
                    <td>
                      <button
                        className=" text-yellow-600 font-bold h5"
                        onClick={() => handleCheck(item)}
                      >
                        <MdOutlineFactCheck />
                      </button>
                    </td>
                  </tr>
                );
              })}
            <tr></tr>
          </tbody>
        </Table>
        )
        }
      </>
    );
  } else {
    return (
        <>
          <div className="flex justify-center items-center text-center h4 py-4">
            No Existen Registros de Pirometria para Verificar
          </div>
        </>
    )
  }
};

export default checkPiro;
