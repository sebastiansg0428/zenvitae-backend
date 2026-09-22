const app = require('./src/app');

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
    console.log(`Zenvitae backend disponible en http://0.0.0.0:${port}`);
});