import { useState } from "react";
import { Offcanvas, Table } from "react-bootstrap";
import { DateTime } from "luxon";
import { getKpiRepuestosCriticos } from "../configuracion/api";

const KpiCriticosOffcanvas = ({ show, handleClose }) => {
  const hoy = DateTime.now().toFormat("yyyy-MM-dd");
  const [desde, setDesde] = useState(hoy.slice(0, 8) + "01");
  const [hasta, setHasta] = useState(hoy);
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(false);

  const consultar = async () => {
    setLoading(true);
    try {
      const data = await getKpiRepuestosCriticos(desde, hasta);
      setKpi(data?.kpi ?? null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" className="w-auto bg-slate-700">
      <Offcanvas.Header>
        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={handleClose}>
          Cerrar
        </button>
        <Offcanvas.Title className="text-white">Repuestos Críticos Utilizados</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="flex flex-wrap items-end gap-3 mb-4">
          <div>
            <label className="f-label text-white block">Desde</label>
            <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="f-input" />
          </div>
          <div>
            <label className="f-label text-white block">Hasta</label>
            <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="f-input" />
          </div>
          <button className="btn-primary" onClick={consultar} disabled={loading}>
            {loading ? "Consultando..." : "Consultar"}
          </button>
        </div>

        {kpi && (
          <div className="pt-2 text-white">
            <p className="mb-3" style={{ fontSize: "1.1rem" }}>
              Total de repuestos críticos utilizados:{" "}
              <span className="fw-bold" style={{ fontSize: "1.5rem" }}>{kpi.totalUtilizado}</span>
            </p>
            {kpi.porRepuesto.length > 0 ? (
              <Table hover variant="dark">
                <thead>
                  <tr>
                    <th style={{ width: "2.5rem" }}>#</th>
                    <th>Repuesto</th>
                    <th className="text-center">Cantidad total</th>
                    <th>Desglose por equipo</th>
                  </tr>
                </thead>
                <tbody>
                  {kpi.porRepuesto.map((r, index) => (
                    <tr key={r.id_repuesto}>
                      <td>{index + 1}</td>
                      <td>{r.nombre}</td>
                      <td className="text-center fw-bold">{r.cantidad}</td>
                      <td>
                        {r.porEquipo.map((e) => (
                          <span key={e.equipo} className="d-inline-block me-2">
                            {e.equipo} <span className="text-zinc-400">({e.cantidad})</span>
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-zinc-300">No se registraron consumos de repuestos críticos en el período seleccionado.</p>
            )}
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default KpiCriticosOffcanvas;
