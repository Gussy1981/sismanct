const MovimientoStock = require("../models/movimientoStock");
const Correctivo = require("../models/mantcorrectivo");
const { DateTime } = require("luxon");

const ARGENTINA_ZONE = "America/Argentina/Buenos_Aires";

const listAll = async (req, res, next) => {
    try {
        const { repuesto } = req.query;
        const filtro = repuesto ? { repuesto } : {};
        const movimientos = await MovimientoStock.find(filtro)
            .populate("repuesto", "nombre marca")
            .sort({ createdAt: -1 });
        res.status(200).json({ status: "Success", movimientos });
    } catch (error) {
        next(error);
    }
};

// KPI: ranking de repuestos críticos más utilizados (egresos - reintegros) en un período,
// desglosado por equipo para detectar si las fallas se concentran en una máquina puntual
const kpiCriticos = async (req, res, next) => {
    try {
        const { desde, hasta } = req.query;

        const filtroFecha = {};
        if (desde) filtroFecha.$gte = DateTime.fromISO(desde, { zone: ARGENTINA_ZONE }).startOf("day").toJSDate();
        if (hasta) {
            filtroFecha.$lte = DateTime.fromISO(hasta, { zone: ARGENTINA_ZONE }).endOf("day").toJSDate();
        }
        const filtro = Object.keys(filtroFecha).length ? { createdAt: filtroFecha } : {};

        const movimientos = await MovimientoStock.find(filtro).populate("repuesto", "nombre criticidad unidadStock");

        const referenciasCorrectivo = [
            ...new Set(
                movimientos
                    .filter((m) => m.motivo === "correctivo" && m.referencia)
                    .map((m) => m.referencia)
            ),
        ];
        const correctivos = await Correctivo.find({ _id: { $in: referenciasCorrectivo } })
            .select("equipo")
            .lean();
        const equipoPorReferencia = {};
        for (const c of correctivos) equipoPorReferencia[c._id.toString()] = c.equipo;

        const porRepuestoMap = {};
        const totalPorUnidad = {};

        for (const mov of movimientos) {
            if (!mov.repuesto || mov.repuesto.criticidad !== "Critico") continue;

            const delta = mov.tipo === "egreso" ? mov.cantidad : -mov.cantidad;
            const unidad = mov.unidad || mov.repuesto.unidadStock || "Unidad";
            totalPorUnidad[unidad] = (totalPorUnidad[unidad] || 0) + delta;

            const key = mov.repuesto._id.toString();
            if (!porRepuestoMap[key]) {
                porRepuestoMap[key] = { id_repuesto: key, nombre: mov.repuesto.nombre, unidad, cantidad: 0, porEquipo: {} };
            }
            porRepuestoMap[key].cantidad += delta;

            const equipo = equipoPorReferencia[mov.referencia] || "Sin equipo asociado";
            porRepuestoMap[key].porEquipo[equipo] = (porRepuestoMap[key].porEquipo[equipo] || 0) + delta;
        }

        const porRepuesto = Object.values(porRepuestoMap)
            .filter((r) => r.cantidad > 0)
            .map((r) => ({
                id_repuesto: r.id_repuesto,
                nombre: r.nombre,
                unidad: r.unidad,
                cantidad: r.cantidad,
                porEquipo: Object.entries(r.porEquipo)
                    .filter(([, cantidadEquipo]) => cantidadEquipo > 0)
                    .map(([equipo, cantidadEquipo]) => ({ equipo, cantidad: cantidadEquipo }))
                    .sort((a, b) => b.cantidad - a.cantidad),
            }))
            .sort((a, b) => b.cantidad - a.cantidad);

        res.status(200).json({
            status: "Success",
            kpi: {
                totalPorUnidad: Object.entries(totalPorUnidad).map(([unidad, cantidad]) => ({
                    unidad,
                    cantidad: Math.max(cantidad, 0),
                })),
                porRepuesto,
                desde: desde || null,
                hasta: hasta || null,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { listAll, kpiCriticos };
