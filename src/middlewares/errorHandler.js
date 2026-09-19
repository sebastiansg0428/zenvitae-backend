function errorHandler(error, request, response, next) {
    console.error(error);
    response.status(500).json({ error: 'Ocurrió un error inesperado en el servidor.' });
}

module.exports = errorHandler;
