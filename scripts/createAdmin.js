require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcrypt');
const pool = require('../src/config/db');
const adminModel = require('../src/models/adminModel');

function ask(question, hidden = false) {
    if (!hidden) {
        return new Promise((resolve) => {
            const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
            rl.question(question, (answer) => {
                rl.close();
                resolve(answer);
            });
        });
    }

    // Oculta la contraseña mientras se escribe, sin usar readline (evita conflictos de lectura de stdin).
    return new Promise((resolve) => {
        process.stdout.write(question);
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        let input = '';
        const onData = (char) => {
            if (char === '\n' || char === '\r' || char === '\u0004') {
                process.stdin.setRawMode(false);
                process.stdin.removeListener('data', onData);
                process.stdin.pause();
                process.stdout.write('\n');
                resolve(input);
                return;
            }
            if (char === '\u0003') {
                process.stdin.setRawMode(false);
                process.exit(1);
            }
            if (char === '\u007f' || char === '\b') {
                input = input.slice(0, -1);
                return;
            }
            input += char;
        };
        process.stdin.on('data', onData);
    });
}

async function main() {
    try {
        const adminCount = await adminModel.countAll();
        if (adminCount > 0) {
            console.error('Ya existe un administrador registrado. El sistema permite un único administrador.');
            process.exit(1);
        }

        const email = (process.env.ADMIN_EMAIL || (await ask('Correo del administrador: '))).trim();
        const password = process.env.ADMIN_PASSWORD || (await ask('Contraseña: ', true));

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            console.error('Correo inválido.');
            process.exit(1);
        }
        if (!password || password.length < 6) {
            console.error('La contraseña debe tener al menos 6 caracteres.');
            process.exit(1);
        }

        const existing = await adminModel.findByEmail(email);
        if (existing) {
            console.error('Ya existe un administrador con ese correo.');
            process.exit(1);
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const admin = await adminModel.create(email, passwordHash);

        console.log(`Administrador creado correctamente (id: ${admin.id}, email: ${admin.email}).`);
        process.exit(0);
    } catch (error) {
        console.error('Error al crear el administrador:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
