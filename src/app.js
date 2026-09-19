const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (request, response) => {
    response.status(200).json({ status: 'ok' });
});

app.use('/api/products', productRoutes);

app.use(errorHandler);

module.exports = app;