const UNIDADES = ["Unidad", "Grs", "Kgs"];
const FACTOR_EN_GRAMOS = { Grs: 1, Kgs: 1000 };

const errorDatos = (message) => Object.assign(new Error(message), { statusCode: 400 });
const redondear = (value) => Math.round((value + Number.EPSILON) * 1000000) / 1000000;

const convertirAUnidadStock = (cantidad, unidadConsumo, unidadStock) => {
    const valor = Number(cantidad);
    if (!Number.isFinite(valor) || valor <= 0) throw errorDatos("La cantidad utilizada debe ser mayor que 0");
    if (!UNIDADES.includes(unidadConsumo) || !UNIDADES.includes(unidadStock)) {
        throw errorDatos("La unidad indicada no es válida");
    }

    if (unidadStock === "Unidad" || unidadConsumo === "Unidad") {
        if (unidadStock !== unidadConsumo) {
            throw errorDatos(`No se puede convertir ${unidadConsumo} a ${unidadStock}`);
        }
        if (!Number.isInteger(valor)) throw errorDatos("Los repuestos por unidad requieren cantidades enteras");
        return valor;
    }

    return redondear((valor * FACTOR_EN_GRAMOS[unidadConsumo]) / FACTOR_EN_GRAMOS[unidadStock]);
};

module.exports = { UNIDADES, convertirAUnidadStock, redondear };
