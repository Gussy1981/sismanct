const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Error interno del servidor";

    return res.status(statusCode).json({
        status: "Error",
        message,
    });
};

module.exports = errorHandler;
