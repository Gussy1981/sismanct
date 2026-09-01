import React, { useEffect, useState } from "react";
import axios from "axios";
import { Global } from "../../helpers/Global";

const KPIsMantenimiento = () => {
    const [kpis, setKpis] = useState(null);
    const [loading, setLoading] = useState(true);
    const formatearHoras = (valor) => {
        const numero = Number(valor);
        if (!Number.isFinite(numero) || numero < 0) return "0:00:00";

        // El KPI llega con el formato H,MMSS... (por ejemplo, 1,491176).
        // Se toman MM y SS, y se normalizan los posibles acarreos.
        const [horasTexto, decimales = ""] = numero.toFixed(6).split(".");
        const minutos = Number(decimales.slice(0, 2).padEnd(2, "0"));
        const segundos = Number(decimales.slice(2, 4).padEnd(2, "0"));
        const totalSegundos = Number(horasTexto) * 3600 + minutos * 60 + segundos;
        const horas = Math.floor(totalSegundos / 3600);
        const minutosNormalizados = Math.floor((totalSegundos % 3600) / 60);
        const segundosNormalizados = totalSegundos % 60;

        return `${horas}:${String(minutosNormalizados).padStart(2, "0")}:${String(segundosNormalizados).padStart(2, "0")}`;
    };

    useEffect(() => {
        const fetchKPIs = async () => {
            try {
                const token = localStorage.getItem("token");
                const { data } = await axios.get(Global.url + "correctivo/kpis", {
                    headers: { Authorization: token },
                });
                setKpis(data.kpis);
            } catch (error) {
                console.error("Error al obtener KPIs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchKPIs();
    }, []);

    if (loading) return <p className="text-center text-muted">Cargando KPIs...</p>;
    if (!kpis) return <p className="text-center text-danger">No se pudieron cargar los KPIs.</p>;

    return (
        <div>
            {/* Tarjetas de resumen */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                    <div className="rounded-lg border-2 border-cyan-700 p-4 text-center bg-white shadow-sm">
                        <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
                            MTTR General
                        </p>
                        <p className="fw-bold mb-0" style={{ fontSize: "2rem", color: "#0e7490" }}>
                            {formatearHoras(kpis.mttrGeneral)} <span style={{ fontSize: "1rem" }}>Hs</span>
                        </p>
                        <p className="text-muted" style={{ fontSize: "0.75rem" }}>
                            Tiempo medio de reparación
                        </p>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="rounded-lg border-2 border-cyan-700 p-4 text-center bg-white shadow-sm">
                        <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
                            Total Correctivos
                        </p>
                        <p className="fw-bold mb-0" style={{ fontSize: "2rem", color: "#0e7490" }}>
                            {kpis.totalCorrectivos}
                        </p>
                        <p className="text-muted" style={{ fontSize: "0.75rem" }}>
                            Registros históricos
                        </p>
                    </div>
                </div>
            </div>

            {/* MTTR por equipo */}
            {kpis.porEquipo.length > 0 && (
                <div className="mb-4">
                    <h6 className="text-cyan-800 fw-semibold mb-2">MTTR por Equipo (Top 10)</h6>
                    <div className="table-responsive">
                        <table className="table table-sm table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Equipo</th>
                                    <th className="text-center">Correctivos</th>
                                    <th className="text-center">MTTR (Hs)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kpis.porEquipo.map((e) => (
                                    <tr key={e.equipo}>
                                        <td>{e.equipo}</td>
                                        <td className="text-center">{e.totalCorrectivos}</td>
                                        <td className="text-center fw-semibold">{formatearHoras(e.mttr)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Correctivos últimos 6 meses */}
            {kpis.ultimosMeses.length > 0 && (
                <div>
                    <h6 className="text-cyan-800 fw-semibold mb-2">Correctivos últimos 6 meses</h6>
                    <div className="d-flex gap-2 flex-wrap">
                        {kpis.ultimosMeses.map(({ mes, cantidad }) => (
                            <div
                                key={mes}
                                className="text-center px-3 py-2 rounded border border-cyan-600"
                                style={{ minWidth: "80px" }}
                            >
                                <div className="fw-bold" style={{ fontSize: "1.3rem", color: "#0e7490" }}>
                                    {cantidad}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "#555" }}>{mes}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default KPIsMantenimiento;
