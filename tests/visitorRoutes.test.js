const assert = require('node:assert/strict');
const { test } = require('node:test');
const { once } = require('node:events');
const app = require('../src/app');
const pool = require('../src/config/db');

async function startServer(t) {
    const server = app.listen(0, '127.0.0.1');
    t.after(() => new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
        server.closeAllConnections();
    }));
    await once(server, 'listening');
    return `http://127.0.0.1:${server.address().port}`;
}

test('POST /api/visitors registra una visita sin token ni body', async (t) => {
    const query = t.mock.method(pool, 'query', async () => [{ insertId: 1 }]);
    const baseUrl = await startServer(t);

    const response = await fetch(`${baseUrl}/api/visitors`, { method: 'POST' });

    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { message: 'Visita registrada' });
    assert.equal(query.mock.callCount(), 1);
    assert.deepEqual(query.mock.calls[0].arguments, [
        'INSERT INTO visitas (createdAt) VALUES (NOW())',
    ]);
});

test('POST /api/visitors informa y registra los errores de MySQL', async (t) => {
    const error = new Error('Database unavailable');
    t.mock.method(pool, 'query', async () => { throw error; });
    const log = t.mock.method(console, 'error', () => {});
    const baseUrl = await startServer(t);

    const response = await fetch(`${baseUrl}/api/visitors`, { method: 'POST' });

    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: 'No se pudo registrar la visita' });
    assert.equal(log.mock.callCount(), 1);
    assert.deepEqual(log.mock.calls[0].arguments, ['Error al registrar visita:', error]);
});

test('GET /api/admin/visitors sigue requiriendo autenticacion', async (t) => {
    const query = t.mock.method(pool, 'query', async () => [[]]);
    const baseUrl = await startServer(t);

    const response = await fetch(`${baseUrl}/api/admin/visitors`);

    assert.equal(response.status, 401);
    assert.equal(query.mock.callCount(), 0);
});
