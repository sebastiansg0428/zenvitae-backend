function errorHandler(error, request, response, next) {
    console.error(error);
    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    const message = error.publicMessage || (statusCode >= 500 ? 'Ocurrió un error inesperado en el servidor.' : error.message);
    response.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
