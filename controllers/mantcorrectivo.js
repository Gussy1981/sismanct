const Correctivo = require("../models/mantcorrectivo");
const Repuesto = require("../models/repuesto");
const MovimientoStock = require("../models/movimientoStock");

const save = async (req, res, next) => {
    const {
        fecha,
        equipo,
        solicitante,
        motivo,
        tareas,
        tiempo,
        repuestosUtilizados,
        responsables,
    } = req.body;

    const decrementados = [];

    try {
        // Decrementar stock de forma atómica: solo si cantidad >= cantidadUtilizada
        for (const repuestoInfo of repuestosUtilizados) {
            const { id_repuesto, cantidad: cantidadUtilizada } = repuestoInfo;

            const repuestoPrevio = await Repuesto.findById(id_repuesto).lean();
            if (!repuestoPrevio) {
                throw Object.assign(new Error(`Repuesto ${id_repuesto} no encontrado`), { statusCode: 404 });
            }

            const actualizado = await Repuesto.findOneAndUpdate(
                { _id: id_repuesto, cantidad: { $gte: cantidadUtilizada } },
                { $inc: { cantidad: -cantidadUtilizada } },
                { new: true }
            );

            if (!actualizado) {
                throw Object.assign(
                    new Error(`Stock insuficiente para el repuesto "${repuestoPrevio.nombre}"`),
                    { statusCode: 400 }
                );
            }

            decrementados.push({
                id_repuesto,
                cantidadUtilizada,
                stockAnterior: repuestoPrevio.cantidad,
                stockResultante: actualizado.cantidad,
                nombreRepuesto: repuestoPrevio.nombre,
            });
        }

        // Crear el correctivo
        const nuevoCorrectivo = new Correctivo({
            fecha,
            equipo,
            solicitante,
            motivo,
            tareas,
            tiempo,
            repuestosUtilizados: repuestosUtilizados.map((r) => ({
                id_repuesto: r.id_repuesto,
                cantidad: r.cantidad,
            })),
            responsables,
        });
        await nuevoCorrectivo.save();

        // Registrar movimientos de stock
        const movimientos = decrementados.map((d) => ({
            repuesto: d.id_repuesto,
            tipo: "egreso",
            cantidad: d.cantidadUtilizada,
            motivo: "correctivo",
            referencia: nuevoCorrectivo._id.toString(),
            usuario: solicitante,
            stockAnterior: d.stockAnterior,
            stockResultante: d.stockResultante,
        }));
        await MovimientoStock.insertMany(movimientos);

        res.status(201).json(nuevoCorrectivo);
    } catch (error) {
        // Rollback: restaurar los decrementos realizados antes del fallo
        for (const d of decrementados) {
            await Repuesto.findByIdAndUpdate(d.id_repuesto, {
                $inc: { cantidad: d.cantidadUtilizada },
            }).catch(() => {});
        }
        next(error);
    }
};

const findByMotivo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const correctivos = await Correctivo.find({ motivo: id })
            .select({ equipo: 1, motivo: 1, responsable: 1, createdAt: 1, tareas: 1 })
            .exec();
        const formattedCorrectivos = correctivos.map((c) => ({
            ...c._doc,
            createdAt: new Date(c.createdAt).toLocaleDateString(),
        }));
        res.status(200).json(formattedCorrectivos);
    } catch (error) {
        next(error);
    }
};

const findMotivoByEquipo = async (req, res, next) => {
    try {
        const { equipoId, motivoId } = req.params;
        const correctivos = await Correctivo.find({ equipo: equipoId, motivo: motivoId });
        const resultado = correctivos.map((c) => ({
            equipo: c.equipo,
            motivo: c.motivo,
            responsable: c.responsable,
            fecha: c.createdAt.toLocaleDateString(),
        }));
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

const deleteCorrectivo = async (req, res, next) => {
    try {
        const correctivoExistente = await Correctivo.findById(req.params.id).lean();
        if (!correctivoExistente) {
            return res.status(404).json({ status: "Error", message: "Registro no encontrado" });
        }

        const movimientos = [];
        for (const { id_repuesto, cantidad } of correctivoExistente.repuestosUtilizados || []) {
            if (!id_repuesto || !cantidad) continue;
            const restaurado = await Repuesto.findByIdAndUpdate(
                id_repuesto,
                { $inc: { cantidad } },
                { new: true }
            );
            if (restaurado) {
                movimientos.push({
                    repuesto: id_repuesto,
                    tipo: "ingreso",
                    cantidad,
                    motivo: "correctivo",
                    referencia: req.params.id,
                    usuario: correctivoExistente.solicitante,
                    stockAnterior: restaurado.cantidad - cantidad,
                    stockResultante: restaurado.cantidad,
                });
            }
        }
        if (movimientos.length) {
            await MovimientoStock.insertMany(movimientos);
        }

        const correctivo = await Correctivo.deleteOne({ _id: req.params.id });
        return res.status(200).json({ status: "Success", message: "Registro eliminado", correctivo });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    const restaurados = [];
    const decrementados = [];

    try {
        const correctivoExistente = await Correctivo.findById(req.params.id).lean();
        if (!correctivoExistente) {
            return res.status(404).json({ status: "Error", message: "Registro no encontrado" });
        }

        const nuevosRepuestos = Array.isArray(req.body.repuestosUtilizados)
            ? req.body.repuestosUtilizados
            : null;

        if (nuevosRepuestos) {
            // 1. Reintegrar al stock las cantidades previamente descontadas por este correctivo
            for (const { id_repuesto, cantidad } of correctivoExistente.repuestosUtilizados || []) {
                if (!id_repuesto || !cantidad) continue;
                const restaurado = await Repuesto.findByIdAndUpdate(
                    id_repuesto,
                    { $inc: { cantidad } },
                    { new: true }
                );
                if (restaurado) {
                    restaurados.push({
                        id_repuesto,
                        cantidad,
                        stockAnterior: restaurado.cantidad - cantidad,
                        stockResultante: restaurado.cantidad,
                    });
                }
            }

            // 2. Descontar del stock las nuevas cantidades utilizadas, de forma atómica
            try {
                for (const repuestoInfo of nuevosRepuestos) {
                    const { id_repuesto, cantidad: cantidadUtilizada } = repuestoInfo;

                    const repuestoPrevio = await Repuesto.findById(id_repuesto).lean();
                    if (!repuestoPrevio) {
                        throw Object.assign(new Error(`Repuesto ${id_repuesto} no encontrado`), { statusCode: 404 });
                    }

                    const actualizado = await Repuesto.findOneAndUpdate(
                        { _id: id_repuesto, cantidad: { $gte: cantidadUtilizada } },
                        { $inc: { cantidad: -cantidadUtilizada } },
                        { new: true }
                    );

                    if (!actualizado) {
                        throw Object.assign(
                            new Error(`Stock insuficiente para el repuesto "${repuestoPrevio.nombre}"`),
                            { statusCode: 400 }
                        );
                    }

                    decrementados.push({
                        id_repuesto,
                        cantidadUtilizada,
                        stockAnterior: repuestoPrevio.cantidad,
                        stockResultante: actualizado.cantidad,
                        nombreRepuesto: repuestoPrevio.nombre,
                    });
                }
            } catch (error) {
                // Rollback de los nuevos decrementos ya aplicados
                for (const d of decrementados) {
                    await Repuesto.findByIdAndUpdate(d.id_repuesto, {
                        $inc: { cantidad: d.cantidadUtilizada },
                    }).catch(() => {});
                }
                // Deshacer la reintegración previa para dejar el stock como estaba
                for (const r of restaurados) {
                    await Repuesto.findByIdAndUpdate(r.id_repuesto, {
                        $inc: { cantidad: -r.cantidad },
                    }).catch(() => {});
                }
                throw error;
            }
        }

        const correctivo = await Correctivo.updateOne({ _id: req.params.id }, req.body, { multi: false });

        const movimientos = [
            ...restaurados.map((r) => ({
                repuesto: r.id_repuesto,
                tipo: "ingreso",
                cantidad: r.cantidad,
                motivo: "correctivo",
                referencia: req.params.id,
                usuario: correctivoExistente.solicitante,
                stockAnterior: r.stockAnterior,
                stockResultante: r.stockResultante,
            })),
            ...decrementados.map((d) => ({
                repuesto: d.id_repuesto,
                tipo: "egreso",
                cantidad: d.cantidadUtilizada,
                motivo: "correctivo",
                referencia: req.params.id,
                usuario: correctivoExistente.solicitante,
                stockAnterior: d.stockAnterior,
                stockResultante: d.stockResultante,
            })),
        ];
        if (movimientos.length) {
            await MovimientoStock.insertMany(movimientos);
        }

        res.status(200).json({ status: "Success", message: "Registro modificado correctamente", correctivo });
    } catch (error) {
        next(error);
    }
};

const listAll = async (req, res, next) => {
    try {
        const searchTerm = req.query.search || "";
        const sortColumn = req.query.sortColumn || "fecha";
        const sortOrder = req.query.sortOrder || "asc";

        const filtro = searchTerm
            ? {
                  $or: [
                      { tareas: { $regex: new RegExp(searchTerm, "i") } },
                      { equipo: { $regex: new RegExp(searchTerm, "i") } },
                      { solicitante: { $regex: new RegExp(searchTerm, "i") } },
                      { motivo: { $regex: new RegExp(searchTerm, "i") } },
                      { responsables: { $regex: new RegExp(searchTerm, "i") } },
                  ],
              }
            : {};

        const sortOptions = { [sortColumn]: sortOrder === "asc" ? 1 : -1 };
        const correctivos = await Correctivo.find(filtro).sort(sortOptions);
        res.json(correctivos);
    } catch (error) {
        next(error);
    }
};

// KPIs: MTTR general, MTTR por equipo, cantidad de correctivos por mes
const getKPIs = async (req, res, next) => {
    try {
        const correctivos = await Correctivo.find({}).lean();

        if (correctivos.length === 0) {
            return res.status(200).json({
                status: "Success",
                kpis: { mttrGeneral: 0, totalCorrectivos: 0, porEquipo: [], ultimosMeses: [] },
            });
        }

        // MTTR general (promedio de tiempo en horas)
        const totalHoras = correctivos.reduce((acc, c) => acc + (c.tiempo || 0), 0);
        const mttrGeneral = parseFloat((totalHoras / correctivos.length).toFixed(2));

        // MTTR por equipo
        const porEquipoMap = {};
        for (const c of correctivos) {
            if (!porEquipoMap[c.equipo]) porEquipoMap[c.equipo] = { total: 0, count: 0 };
            porEquipoMap[c.equipo].total += c.tiempo || 0;
            porEquipoMap[c.equipo].count += 1;
        }
        const porEquipo = Object.entries(porEquipoMap)
            .map(([equipo, { total, count }]) => ({
                equipo,
                mttr: parseFloat((total / count).toFixed(2)),
                totalCorrectivos: count,
            }))
            .sort((a, b) => b.totalCorrectivos - a.totalCorrectivos)
            .slice(0, 10);

        // Correctivos por mes (últimos 6 meses)
        const seisMesesAtras = new Date();
        seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 5);
        seisMesesAtras.setDate(1);
        seisMesesAtras.setHours(0, 0, 0, 0);

        const mesesMap = {};
        for (const c of correctivos) {
            const fecha = new Date(c.fecha || c.createdAt);
            if (fecha < seisMesesAtras) continue;
            const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
            mesesMap[key] = (mesesMap[key] || 0) + 1;
        }
        const ultimosMeses = Object.entries(mesesMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([mes, cantidad]) => ({ mes, cantidad }));

        res.status(200).json({
            status: "Success",
            kpis: { mttrGeneral, totalCorrectivos: correctivos.length, porEquipo, ultimosMeses },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    save,
    findByMotivo,
    findMotivoByEquipo,
    deleteCorrectivo,
    update,
    listAll,
    getKPIs,
};
