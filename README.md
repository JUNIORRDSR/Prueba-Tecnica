# ProjectInsight · Prueba Técnica

Panel fullstack para gestión de proyectos que combina una API REST en Node.js, base de datos PostgreSQL con Prisma, documentación Swagger, visualizaciones en tiempo real y un resumen generado por IA.

![Vista del dashboard](docs/screenshots/image.png)

## ✨ Características principales

- **CRUD completo de proyectos** con validaciones y manejo centralizado de errores.
- **Prisma + PostgreSQL** como capa de persistencia (modelo `Proyecto`).
- **Documentación Swagger** disponible en `/docs` para cada endpoint.
- **Dashboard responsivo** (Bootstrap 5 + Chart.js) con KPIs, tablas, gráficos y sección IA.
- **Resumen IA** vía DeepSeek (SSE); incluye fallback local para entornos sin API Key.
- **Arquitectura modular** (controllers, services, rutas, middlewares) fácil de extender.

## 🧱 Stack tecnológico

- Node.js 20 + Express
- Prisma ORM + PostgreSQL
- Bootstrap 5, Chart.js, Axios
- EJS (SSR) + assets estáticos (`/assets/css|js`)
- Swagger UI + swagger-jsdoc

## 🚀 Puesta en marcha

### 1. Requisitos

- Node.js 20+
- PostgreSQL 14+ (local o en contenedor)
- npm 10+

### 2. Variables de entorno

Crea un archivo `.env` en la raíz con al menos:

```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/pruebas?schema=public"
# Opcional: habilita DeepSeek
# DEEPSEEK_API_KEY=sk-...
```

### 3. Instalación

```bash
npm install
npx prisma migrate deploy   # o npx prisma migrate dev --name init
npx prisma generate
```

> 💡 Si deseas poblar datos rápidamente, puedes usar Prisma Studio (`npx prisma studio`) o realizar peticiones POST al endpoint `/api/proyectos` (ver sección API).

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación quedará disponible en `http://localhost:3000` y la documentación Swagger en `http://localhost:3000/docs`.

### 5. Verificar conexión a la base de datos

Asegúrate de que PostgreSQL esté accesible con las credenciales declaradas en `DATABASE_URL`. Si usas Docker, puedes levantar un contenedor rápido
```bash
docker run --name prueba-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=pruebas -p 5432:5432 -d postgres:16-alpine
```

Luego ajusta `DATABASE_URL` con `user=postgres` y `password=postgres`.

## 🧩 Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/proyectos` | Lista proyectos ordenados por ID desc. |
| POST | `/api/proyectos` | Crea un proyecto. |
| GET | `/api/proyectos/:id` | Obtiene un proyecto específico. |
| PUT | `/api/proyectos/:id` | Actualiza campos de un proyecto. |
| DELETE | `/api/proyectos/:id` | Elimina un proyecto. |
| GET | `/api/graficos` | Devuelve agregados para gráficos (labels/data). |
| GET | `/api/analisis` | Stream SSE con resumen IA o JSON fallback. |

Consulta la especificación completa en `/docs` (Swagger UI). Se añadieron los esquemas `Proyecto` y `ProyectoInput` para una mejor exploración.

## 🧠 Resumen IA (DeepSeek)

- Si `DEEPSEEK_API_KEY` está configurada, el endpoint `/api/analisis` utiliza SSE y va emitiendo fragmentos (`chunk`) hasta cerrar con `{ done: true }`.
- En ausencia de la API Key, se responde inmediatamente con un JSON que resume los proyectos usando datos locales.
- En el frontend, el botón **Generar resumen** crea una conexión `EventSource` y muestra el contenido en el panel IA.

## 🖥️ Interfaz web

- `/` renderiza `views/index.ejs` con un dashboard oscuro y responsivo.
- KPIs, gráficos y tabla consumen los endpoints de la API con Axios.
- Los formularios usan validaciones mínimas; el modal de edición hereda el mismo lenguaje visual.
- Diseño responsive.


## 🐳 Docker

Los archivos `Dockerfile` y `docker-compose.yml` permiten levantar la API y PostgreSQL juntos. Para construir e iniciar todo:

```bash
docker compose up --build
```

- El servicio `postgres` usa `postgres:16-alpine` y persiste datos en el volumen `postgres-data`.
- El servicio `app` construye la imagen Node, ejecuta `npx prisma migrate deploy` y arranca en el puerto `3000`.
- Ajusta `DEEPSEEK_API_KEY` (si cuentas con la clave) exportándola antes del comando o agregándola al archivo `.env`.
- Para detener y limpiar contenedores: `docker compose down`; agrega `-v` si quieres borrar el volumen.

---

> Si clonas este repo desde cero: configura `.env`, ejecuta migraciones, inicia el server y abre `http://localhost:3000`.

## 📦 Ejecutar con imagen de Docker Hub

Si prefieres evitar la build local, puedes tirar del registry y ejecutar directamente la imagen publicada `juniorrdsr/prueba-tecnica:latest`.

1. Crear red y base de datos con alias `postgres`:

```bash
docker network create projectinsight-net

docker run -d \
  --name projectinsight-db \
  --network projectinsight-net \
  --network-alias postgres \
  -e POSTGRES_DB=pruebas \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -v projectinsight-data:/var/lib/postgresql/data \
  postgres:16-alpine
```

2. Levantar la app desde Docker Hub:

```bash
docker run -d \
  --name projectinsight-app \
  --network projectinsight-net \
  -p 3000:3000 \
  -e PORT=3000 \
  -e DATABASE_URL="postgresql://postgres:postgres@postgres:5432/pruebas" \
  -e DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY:-} \
  juniorrdsr/prueba-tecnica:latest
```

3. Verificar:

- Dashboard: <http://localhost:3000/>
- Swagger: <http://localhost:3000/docs>

## 📱 Vista móvil (Samsung S20 Ultra)

<!-- markdownlint-disable-next-line MD033 -->
<p align="center">
  <img src="docs/screenshots/image4.png" alt="Vista móvil Samsung S20 Ultra" width="300" />
</p>
