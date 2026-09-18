const app = require('./src/app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Zenvitae backend disponible en http://localhost:${port}`);
});