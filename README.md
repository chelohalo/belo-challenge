<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Fintech API

API para gestionar cuentas virtuales y transacciones entre usuarios. Este proyecto simula una plataforma fintech donde los usuarios pueden tener saldo en sus cuentas y realizar transacciones entre ellos.

## 🚀 Características

- Gestión de usuarios con saldo en cuenta
- Sistema de transacciones entre usuarios
- Validación automática de transacciones según el monto
- Documentación de API con Swagger
- Base de datos PostgreSQL con TypeORM
- Datos de ejemplo automáticos en desarrollo

## 📋 Requisitos Previos

- Node.js (v20 o superior)
- PostgreSQL
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd fintech-api
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar la base de datos**

   - Asegúrate de tener PostgreSQL instalado y corriendo
   - Conéctate a PostgreSQL usando psql:

   ```bash
   psql postgres
   ```

   - Crea la base de datos:

   ```sql
   CREATE DATABASE fintech;
   ```

   - Verifica que la base de datos se haya creado:

   ```sql
   \l
   ```

4. **Configurar variables de entorno**
   Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

   ```
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=****
   DB_PASSWORD=****
   DB_DATABASE=fintech

   # Application Configuration
   NODE_ENV=development
   PORT=3000
   ```

   Reemplaza `****` con tus credenciales de PostgreSQL.

5. **Iniciar la aplicación**

```bash
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3000`
La documentación Swagger estará disponible en `http://localhost:3000/api`

## 🌱 Datos de Ejemplo

Al iniciar la aplicación en modo desarrollo, se crearán automáticamente los siguientes datos de ejemplo:

### Usuarios

- Juan Pérez: $100,000
- María García: $50,000
- Carlos López: $75,000

### Transacciones

- Transacción confirmada: Juan → María ($25,000)
- Transacción pendiente: María → Carlos ($60,000)
- Transacción confirmada: Carlos → Juan ($15,000)

## 📚 Endpoints

### Transacciones

- `POST /transactions` - Crear una nueva transacción

  ```json
  {
    "originId": 1,
    "destinationId": 2,
    "amount": 25000
  }
  ```

- `GET /transactions?userId=:id` - Listar transacciones de un usuario

  - Muestra todas las transacciones donde el usuario es origen o destino
  - Ordenadas por fecha (más recientes primero)

- `PATCH /transactions/:id/approve` - Aprobar una transacción pendiente

  - Solo funciona con transacciones en estado pendiente
  - Realiza el movimiento de fondos

- `PATCH /transactions/:id/reject` - Rechazar una transacción pendiente
  - Solo funciona con transacciones en estado pendiente
  - No modifica saldos

## ⚖️ Reglas de Negocio

- Las transacciones mayores a $50.000 quedan en estado pendiente para verificación manual
- Las transacciones menores o iguales a $50.000 se confirman automáticamente
- No se permiten saldos negativos
- Las transacciones son atómicas (si falla el débito o crédito, no se realiza)
- Se mantiene un registro de todas las operaciones

## 🧪 Tests

Para ejecutar los tests:

```bash
npm run test
```

## 🔍 Estructura del Proyecto

```
src/
├── config/           # Configuraciones de la aplicación
├── database/         # Configuración de la base de datos y seeders
├── users/           # Módulo de usuarios
├── transactions/    # Módulo de transacciones
└── main.ts         # Punto de entrada de la aplicación
```


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
