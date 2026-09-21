const assistantService = require('../services/assistantService');

async function chat(request, response, next) {
    try {
        const { message, history } = request.body;
        if (typeof message !== 'string' || message.trim().length === 0) {
            return response.status(400).json({ error: 'El campo "message" es obligatorio.' });
        }

        const answer = await assistantService.askAssistant(message, history);
        response.status(200).json({ answer });
    } catch (error) {
        next(error);
    }
}

module.exports = { chat };