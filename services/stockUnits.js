// Cada unidad pertenece a una magnitud y define su factor respecto de la unidad
// base de esa magnitud. Solo se permite convertir entre unidades de la misma
// magnitud. "Unidad" es su propia magnitud (conteo) y exige cantidades enteras.
const DEFINICION_UNIDADES = {
    Unidad: { magnitud: "conteo", factor: 1, entera: true },
    Grs: { magnitud: "masa", factor: 1 },
    Kgs: { magnitud: "masa", factor: 1000 },
    Lts: { magnitud: "volumen", factor: 1 },
    Mts: { magnitud: "longitud", factor: 1 },
};

const UNIDADES = Object.keys(DEFINICION_UNIDADES);

const errorDatos = (message) => Object.assign(new Error(message), { statusCode: 400 });
const redondear = (value) => Math.round((value + Number.EPSILON) * 1000000) / 1000000;

// Unidades de consumo válidas para un repuesto según su unidad de stock.
const unidadesCompatibles = (unidadStock) => {
    const def = DEFINICION_UNIDADES[unidadStock];
    if (!def) return ["Unidad"];
    return UNIDADES.filter((u) => DEFINICION_UNIDADES[u].magnitud === def.magnitud);
};

const convertirAUnidadStock = (cantidad, unidadConsumo, unidadStock) => {
    const valor = Number(cantidad);
    if (!Number.isFinite(valor) || valor <= 0) throw errorDatos("La cantidad utilizada debe ser mayor que 0");

    const defConsumo = DEFINICION_UNIDADES[unidadConsumo];
    const defStock = DEFINICION_UNIDADES[unidadStock];
    if (!defConsumo || !defStock) throw errorDatos("La unidad indicada no es válida");

    if (defConsumo.magnitud !== defStock.magnitud) {
        throw errorDatos(`No se puede convertir ${unidadConsumo} a ${unidadStock}`);
    }

    if (defConsumo.entera || defStock.entera) {
        if (!Number.isInteger(valor)) throw errorDatos("Los repuestos por unidad requieren cantidades enteras");
        return valor;
    }

    return redondear((valor * defConsumo.factor) / defStock.factor);
};

module.exports = { UNIDADES, DEFINICION_UNIDADES, unidadesCompatibles, convertirAUnidadStock, redondear };
