# Zenvitae Backend

Backend independiente para Zenvitae con Node.js, Express y MySQL.

## Variables de entorno

Copiar `.env.example` a `.env` y completar los valores:

| Variable                         | Descripción                                                                                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DB_HOST`                        | Host del servidor MySQL                                                                                                                                                   |
| `DB_PORT`                        | Puerto de MySQL (por defecto 3306)                                                                                                                                        |
| `DB_USER`                        | Usuario de MySQL                                                                                                                                                          |
| `DB_PASSWORD`                    | Contraseña de MySQL                                                                                                                                                       |
| `DB_NAME`                        | Nombre de la base de datos (`zenvitae`)                                                                                                                                   |
| `PORT`                           | Puerto en el que escucha el servidor Express                                                                                                                              |
| `JWT_SECRET`                     | Secreto usado para firmar/verificar los JWT de administrador. Debe ser largo y aleatorio, y nunca compartirse ni versionarse                                              |
| `JWT_EXPIRES_IN`                 | Tiempo de expiración del token (ej. `8h`, `1d`)                                                                                                                           |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Opcionales, solo usadas por `scripts/createAdmin.js` para crear el primer administrador sin pedir input interactivo. Si no se definen, el script las solicita por consola |

## Scripts

- `npm start` — inicia el servidor
- `npm run db:seed` — carga productos de ejemplo
- `npm run admin:create` — crea el primer administrador (pide correo/contraseña por consola o toma `ADMIN_EMAIL`/`ADMIN_PASSWORD` del entorno)

## Endpoints

### Productos (públicos)

- `GET /api/products` — lista todos los productos
- `GET /api/products/:id` — obtiene un producto por id

### Productos (protegidos — requieren JWT de administrador)

Enviar el token en el header: `Authorization: Bearer <token>`

- `POST /api/products` — crea un producto
- `PUT /api/products/:id` — actualiza un producto
- `DELETE /api/products/:id` — elimina un producto

Body esperado (POST/PUT):

```json
{
  "name": "string",
  "category": "string",
  "categoryLabel": "string",
  "description": "string",
  "price": 0,
  "inStock": true,
  "image": "string"
}
```

### Autenticación

- `POST /api/auth/login` — inicia sesión de administrador

  Body:

  ```json
  { "email": "admin@zenvitae.com", "password": "contraseña" }
  ```

  Respuesta exitosa (200):

  ```json
  { "token": "<jwt>" }
  ```

  Errores: `400` (datos inválidos), `401` (credenciales incorrectas).

> **Política de administrador único:** no existe ninguna ruta para registrar administradores por API. El único administrador se crea con `npm run admin:create` (ver sección de Scripts); el script rechaza crear un segundo administrador si ya existe uno.
