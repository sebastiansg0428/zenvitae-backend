const assert = require('node:assert/strict');
const { test, beforeEach } = require('node:test');
const productModel = require('../src/models/productModel');
const assistantService = require('../src/services/assistantService');

function geminiResponse(status, body) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

const okBody = { candidates: [{ content: { parts: [{ text: 'Respuesta de prueba' }] } }] };
const busyBody = { error: { message: 'This model is currently experiencing high demand.' } };

beforeEach((t) => {
    process.env.GEMINI_API_KEY = 'test-key';
    t.mock.method(productModel, 'findAll', async () => []);
    t.mock.method(console, 'warn', () => {});
});

test('reintenta cuando Gemini está saturado y devuelve la respuesta', async (t) => {
    const responses = [geminiResponse(503, busyBody), geminiResponse(200, okBody)];
    const fetchMock = t.mock.method(globalThis, 'fetch', async () => responses.shift());

    const answer = await assistantService.askAssistant('Hola');

    assert.equal(answer, 'Respuesta de prueba');
    assert.equal(fetchMock.mock.callCount(), 2);
});

test('tras 3 intentos saturados devuelve 503 con mensaje claro', async (t) => {
    const fetchMock = t.mock.method(globalThis, 'fetch', async () => geminiResponse(503, busyBody));

    await assert.rejects(assistantService.askAssistant('Hola'), (error) => {
        assert.equal(error.statusCode, 503);
        assert.equal(
            error.publicMessage,
            'El asistente está muy ocupado en este momento. Intenta de nuevo en unos segundos.'
        );
        return true;
    });
    assert.equal(fetchMock.mock.callCount(), 3);
});

test('no reintenta cuando la cuota está agotada (429)', async (t) => {
    const fetchMock = t.mock.method(globalThis, 'fetch', async () =>
        geminiResponse(429, { error: { message: 'Quota exceeded' } })
    );

    await assert.rejects(assistantService.askAssistant('Hola'), (error) => {
        assert.equal(error.statusCode, 429);
        return true;
    });
    assert.equal(fetchMock.mock.callCount(), 1);
});

test('no reintenta cuando el modelo no existe (404)', async (t) => {
    const fetchMock = t.mock.method(globalThis, 'fetch', async () =>
        geminiResponse(404, { error: { message: 'Model not found' } })
    );

    await assert.rejects(assistantService.askAssistant('Hola'), (error) => {
        assert.equal(error.statusCode, 502);
        assert.equal(error.publicMessage, 'El modelo de Gemini no está disponible. Revisa GEMINI_MODEL.');
        return true;
    });
    assert.equal(fetchMock.mock.callCount(), 1);
});
