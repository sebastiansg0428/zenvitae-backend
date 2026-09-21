const productModel = require('../models/productModel');

const assistantInstructions = `
Eres Zenvitae AI, asistente de una tienda colombiana de suplementos deportivos.

Responde siempre en español, de manera clara, breve y práctica, con un tono profesional, cercano y orientado a ayudar a comprar.

Reglas:
- Recomienda únicamente categorías o productos presentes en el catálogo proporcionado.
- Explica por qué una categoría puede relacionarse con el objetivo del usuario.
- Sugiere como máximo 3 opciones.
- No hagas diagnósticos médicos, no prescribas tratamientos ni prometas resultados.
- No inventes productos, precios, disponibilidad, ingredientes o beneficios.
- Si falta información, pregunta por el objetivo, experiencia y restricciones del usuario.
- Ante condiciones médicas, embarazo, lactancia o medicación, recomienda consultar a un profesional de la salud.
- Si la consulta no trata de fitness, nutrición o suplementación deportiva, redirígela amablemente hacia el catálogo de Zenvitae.
- Termina indicando qué categoría puede explorar el usuario en la página de inicio.
- Toda recomendación nutricional debe incluir este aviso: "Información orientativa; consulta a un profesional de la salud antes de usar suplementos.".
- Completa siempre las frases y respuestas. No termines una oración a la mitad.
`;

function buildCatalog(products) {
    return products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        categoryLabel: product.categoryLabel,
        description: product.description,
        price: product.price,
        inStock: product.inStock,
    }));
}

function normalizeMessages(messages) {
    if (!Array.isArray(messages)) {
        return [];
    }

    return messages
        .filter(
            (message) =>
                message &&
                ['user', 'assistant'].includes(message.role) &&
                typeof message.content === 'string' &&
                message.content.trim().length > 0
        )
        .slice(-10)
        .map((message) => ({
            role: message.role,
            content: message.content.trim().slice(0, 2000),
        }));
}

async function askAssistant(message, history = []) {
    if (!process.env.GEMINI_API_KEY) {
        const error = new Error('El asistente no está configurado. Falta GEMINI_API_KEY.');
        error.statusCode = 503;
        error.publicMessage = error.message;
        throw error;
    }

    const products = await productModel.findAll();
    const catalog = JSON.stringify(buildCatalog(products));
    const contents = [
        ...normalizeMessages(history).map((item) => ({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.content }],
        })),
        { role: 'user', parts: [{ text: message.trim().slice(0, 2000) }] },
    ];
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [
                        {
                            text: `${assistantInstructions}\n\nCatálogo actual de Zenvitae (fuente única de productos):\n${catalog}`,
                        },
                    ],
                },
                contents,
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 500,
                },
            }),
        }
    );

    const data = await response.json();
    if (!response.ok) {
        const error = new Error(data.error?.message || 'Gemini rechazó la solicitud.');
        error.statusCode = response.status === 429 ? 429 : 502;
        error.publicMessage =
            response.status === 401
                ? 'La clave de Gemini no es válida. Revisa GEMINI_API_KEY.'
                : response.status === 404
                    ? 'El modelo de Gemini no está disponible. Revisa GEMINI_MODEL.'
                    : response.status === 429
                        ? 'Se agotó la cuota gratuita de Gemini o hay demasiadas solicitudes.'
                        : 'Gemini no pudo responder. Revisa la clave, la cuota y la conexión.';
        throw error;
    }

    const finishReason = data.candidates?.[0]?.finishReason;
    if (finishReason === 'MAX_TOKENS') {
        console.warn('Gemini agotó maxOutputTokens al responder al asistente.');
    }

    return (
        data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim() ||
        'No pude generar una respuesta en este momento.'
    );
}

module.exports = { askAssistant };