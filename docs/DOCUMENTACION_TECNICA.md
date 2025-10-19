# Documentación Técnica - Prueba Técnica GLocation

**Candidato:** Junior Rodriguez  
**Fecha de entrega:** 20 de Enero, 2025  
**Repositorio:** [https://github.com/JUNIORRDSR/Prueba-Tecnica](https://github.com/JUNIORRDSR/Prueba-Tecnica)  
**Aplicación desplegada:** Docker Hub - `juniorrdsr/prueba-tecnica:latest`

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura de la Solución](#arquitectura-de-la-solución)
4. [Decisiones Técnicas](#decisiones-técnicas)
5. [Implementación](#implementación)
6. [Instalación y Ejecución](#instalación-y-ejecución)
7. [API REST - Endpoints](#api-rest---endpoints)
8. [Integración con IA](#integración-con-ia)
9. [Frontend Responsivo](#frontend-responsivo)
10. [Docker y Despliegue](#docker-y-despliegue)
11. [Evidencias Visuales](#evidencias-visuales)
12. [Conclusiones](#conclusiones)

---

## Resumen Ejecutivo

**ProjectInsight** es una aplicación fullstack para la gestión de proyectos que cumple con todos los requerimientos de la prueba técnica. La solución incluye:

- **API REST completa** con operaciones CRUD sobre la entidad `Proyecto`
- **Base de datos PostgreSQL** con Prisma ORM
- **Documentación Swagger** accesible en `/docs`
- **Integración con IA generativa** (DeepSeek API) para análisis de proyectos
- **Frontend responsivo** con visualizaciones en tiempo real (Chart.js)
- **Despliegue con Docker** (Dockerfile + docker-compose.yml)
- **Imagen publicada en Docker Hub** para facilitar el despliegue

El proyecto fue desarrollado siguiendo las mejores prácticas de desarrollo, con una arquitectura modular, manejo centralizado de errores, validaciones robustas y código limpio y documentado.

---

## Stack Tecnológico

### Backend
- **Node.js 20+** - Runtime de JavaScript
- **Express 5.1** - Framework web minimalista
- **Prisma 6.17** - ORM moderno para PostgreSQL
- **PostgreSQL 16** - Base de datos relacional
- **swagger-jsdoc + swagger-ui-express** - Documentación automática de API
- **dotenv** - Gestión de variables de entorno
- **cors** - Middleware para habilitar CORS

### Frontend
- **EJS** - Motor de plantillas para SSR
- **Bootstrap 5** - Framework CSS para diseño responsivo
- **Chart.js** - Librería para gráficos interactivos
- **Axios** - Cliente HTTP para consumir la API

### IA Generativa
- **DeepSeek API** - Modelo de IA para generación de resúmenes
- **OpenAI SDK** - Cliente para integración con APIs de IA
- **SSE (Server-Sent Events)** - Streaming de respuestas en tiempo real

### DevOps
- **Docker** - Contenedorización de la aplicación
- **Docker Compose** - Orquestación de servicios
- **Docker Hub** - Registro público de imágenes

---

## Arquitectura de la Solución

### Estructura del Proyecto

```
Prueba-Tecnica/
├── src/
│   ├── app.js                          # Punto de entrada de la aplicación
│   ├── swagger.js                      # Configuración de Swagger
│   ├── controllers/                    # Controladores de las rutas
│   │   ├── proyectos.controller.js
│   │   ├── analisis.controller.js
│   │   └── graficos.controller.js
│   ├── services/                       # Lógica de negocio
│   │   ├── proyectos.service.js
│   │   ├── analisis.service.js
│   │   └── graficos.service.js
│   ├── routes/                         # Definición de rutas
│   │   ├── proyectos.routes.js
│   │   ├── analisis.routes.js
│   │   └── graficos.routes.js
│   ├── middlewares/                    # Middlewares personalizados
│   │   └── errorHandler.js
│   ├── db/
│   │   └── prismaClient.js            # Cliente de Prisma
│   ├── views/                          # Plantillas EJS
│   │   └── index.ejs
│   └── public/                         # Assets estáticos
│       └── assets/
│           ├── css/
│           └── js/
├── prisma/
│   ├── schema.prisma                   # Esquema de base de datos
│   └── migrations/                     # Migraciones de Prisma
├── docker/
│   └── entrypoint.sh                   # Script de inicio para Docker
├── docs/
│   └── screenshots/                    # Capturas de pantalla
├── Dockerfile                          # Imagen Docker de la aplicación
├── docker-compose.yml                  # Orquestación de servicios
├── package.json                        # Dependencias del proyecto
└── README.md                           # Documentación del usuario
```

### Arquitectura de Capas

La aplicación sigue una arquitectura de tres capas:

```
┌─────────────────────────────────────────┐
│          Frontend (EJS + JS)            │
│  - Dashboard responsivo                 │
│  - Formularios de gestión               │
│  - Gráficos con Chart.js                │
└─────────────────┬───────────────────────┘
                  │ HTTP/REST
┌─────────────────▼───────────────────────┐
│         Backend (Express)                │
│  ┌─────────────────────────────────┐   │
│  │   Routes → Controllers          │   │
│  │         ↓                        │   │
│  │      Services                    │   │
│  │         ↓                        │   │
│  │    Prisma Client                 │   │
│  └─────────────────────────────────┘   │
└─────────────────┬───────────────────────┘
                  │ Prisma ORM
┌─────────────────▼───────────────────────┐
│        PostgreSQL Database               │
│  - Tabla: Proyecto                       │
└──────────────────────────────────────────┘

     ┌───────────────────┐
     │   DeepSeek API    │
     │   (IA Externa)    │
     └───────────────────┘
```

### Modelo de Datos

```prisma
model Proyecto {
  id          Int       @id @default(autoincrement())
  nombre      String
  descripcion String
  estado      String    // "EN_PROGRESO", "FINALIZADO", "PENDIENTE"
  fechaInicio DateTime
  fechaFin    DateTime?
}
```

---

## Decisiones Técnicas

### 1. Elección de Prisma como ORM

**Justificación:**
- **Type-safety**: Prisma genera tipos automáticamente para TypeScript/JavaScript moderno
- **Developer Experience**: Prisma Studio facilita la visualización y gestión de datos
- **Migraciones**: Sistema de migraciones robusto y fácil de usar
- **Performance**: Consultas optimizadas automáticamente

**Alternativas consideradas:** Sequelize, TypeORM

### 2. Arquitectura Modular (MVC)

**Justificación:**
- **Separación de responsabilidades**: Controllers manejan HTTP, Services contienen lógica de negocio
- **Mantenibilidad**: Código organizado y fácil de encontrar
- **Testabilidad**: Cada capa puede ser probada independientemente
- **Escalabilidad**: Fácil agregar nuevas features sin afectar código existente

### 3. DeepSeek para IA Generativa

**Justificación:**
- **API gratuita**: Permite pruebas sin costo
- **Compatible con OpenAI SDK**: Fácil integración con librerías existentes
- **Streaming SSE**: Respuestas en tiempo real para mejor UX
- **Fallback local**: Sistema funciona sin API Key usando resumen básico

### 4. Bootstrap 5 para Frontend

**Justificación:**
- **Diseño responsivo**: Grid system y componentes adaptativos
- **Componentes pre-construidos**: Modales, cards, navbars, etc.
- **Dark mode**: Tema oscuro profesional sin CSS adicional
- **Compatibilidad**: Funciona en todos los navegadores modernos

### 5. EJS para Server-Side Rendering

**Justificación:**
- **Simplicidad**: Sintaxis familiar similar a HTML
- **Performance**: Renderizado del servidor reduce carga en cliente
- **SEO-friendly**: Contenido renderizado en servidor
- **No requiere build**: Desarrollo más rápido

### 6. Docker para Despliegue

**Justificación:**
- **Portabilidad**: Funciona en cualquier sistema con Docker
- **Consistencia**: Mismo entorno en desarrollo, staging y producción
- **Fácil setup**: Un solo comando para levantar todo
- **Aislamiento**: Dependencias no afectan el sistema host

### 7. Swagger para Documentación

**Justificación:**
- **Documentación automática**: Generada desde comentarios JSDoc
- **Interactive**: Permite probar endpoints desde el navegador
- **Estándar de industria**: OpenAPI 3.0 ampliamente adoptado
- **Mantenibilidad**: La documentación vive junto al código

---

## Implementación

### 1. API REST - CRUD Completo

#### Endpoints Implementados

| Método | Endpoint | Descripción | Validaciones |
|--------|----------|-------------|--------------|
| GET | `/api/proyectos` | Listar todos los proyectos | - |
| POST | `/api/proyectos` | Crear un nuevo proyecto | nombre, estado, fechaInicio requeridos |
| GET | `/api/proyectos/:id` | Obtener un proyecto específico | ID válido |
| PUT | `/api/proyectos/:id` | Actualizar un proyecto | fechaFin >= fechaInicio |
| DELETE | `/api/proyectos/:id` | Eliminar un proyecto | ID válido |
| GET | `/api/graficos` | Datos agregados para gráficos | - |
| GET | `/api/analisis` | Resumen IA de proyectos | - |

#### Validaciones Implementadas

```javascript
// Estados válidos
const estadosValidos = ['EN_PROGRESO', 'FINALIZADO', 'PENDIENTE'];

// Validación de fechas
if (fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
  throw new Error('fechaFin no puede ser menor a fechaInicio');
}

// Validación de ID
function parseId(param) {
  const id = Number(param);
  if (Number.isNaN(id)) {
    throw new Error('ID inválido');
  }
  return id;
}
```

#### Manejo de Errores Centralizado

```javascript
// middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  
  console.error(`[ERROR] ${status} - ${message}`);
  
  res.status(status).json({
    error: true,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};
```

### 2. Base de Datos con Prisma

#### Configuración

```javascript
// src/db/prismaClient.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

export default prisma;
```

#### Operaciones CRUD en Service Layer

```javascript
// services/proyectos.service.js
import prisma from '../db/prismaClient.js';

export async function crearProyecto(data) {
  return await prisma.proyecto.create({ data });
}

export async function listarProyectos() {
  return await prisma.proyecto.findMany({
    orderBy: { id: 'desc' }
  });
}

export async function obtenerProyectoPorId(id) {
  return await prisma.proyecto.findUnique({
    where: { id }
  });
}

export async function actualizarProyecto(id, data) {
  return await prisma.proyecto.update({
    where: { id },
    data
  });
}

export async function eliminarProyecto(id) {
  return await prisma.proyecto.delete({
    where: { id }
  });
}
```

### 3. Documentación Swagger

La documentación se genera automáticamente usando JSDoc comments:

```javascript
/**
 * @swagger
 * /api/proyectos:
 *   get:
 *     summary: Listar todos los proyectos
 *     tags: [Proyectos]
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Proyecto'
 */
```

Accesible en: **http://localhost:3000/docs**

### 4. Integración con IA (DeepSeek)

#### Implementación con SSE

```javascript
export async function generarAnalisis(req, res, next) {
  try {
    const proyectos = await proyectosService.listarProyectos();
    
    if (!process.env.DEEPSEEK_API_KEY) {
      // Fallback sin IA
      return res.json({
        resumen: `Análisis de ${proyectos.length} proyectos...`,
        proyectos: proyectos.length,
        // ... más datos locales
      });
    }

    // Streaming con SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'Eres un analista de proyectos...' },
        { role: 'user', content: prompt }
      ],
      stream: true
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    next(err);
  }
}
```

### 5. Frontend Responsivo

#### Dashboard Interactivo

El frontend incluye:
- **KPIs**: Total de proyectos, en progreso, finalizados
- **Tabla dinámica**: Listado de proyectos con acciones (editar/eliminar)
- **Gráfico de torta**: Distribución de proyectos por estado (Chart.js)
- **Panel IA**: Generación de resumen con streaming en tiempo real
- **Formularios**: Modal para crear/editar proyectos con validación

#### Código del Frontend

```javascript
// Consumo de API con Axios
async function cargarProyectos() {
  const { data } = await axios.get('/api/proyectos');
  renderizarTabla(data);
  actualizarKPIs(data);
}

// Generación de resumen con SSE
function generarResumenIA() {
  const eventSource = new EventSource('/api/analisis');
  let contenidoCompleto = '';
  
  eventSource.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.done) {
      eventSource.close();
    } else if (data.chunk) {
      contenidoCompleto += data.chunk;
      document.getElementById('analisisText').innerHTML = 
        marked.parse(contenidoCompleto);
    }
  };
}

// Gráfico con Chart.js
async function cargarGrafico() {
  const { data } = await axios.get('/api/graficos');
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.data,
        backgroundColor: ['#28a745', '#ffc107', '#dc3545']
      }]
    }
  });
}
```

---

## Instalación y Ejecución

### Opción 1: Ejecución Local

#### Requisitos Previos
- Node.js 20+
- PostgreSQL 14+
- npm 10+

#### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/JUNIORRDSR/Prueba-Tecnica.git
cd Prueba-Tecnica
```

2. **Configurar variables de entorno**
```bash
# Crear archivo .env
cat > .env << EOF
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pruebas?schema=public"
# Opcional: DEEPSEEK_API_KEY=sk-xxxxx
EOF
```

3. **Instalar dependencias**
```bash
npm install
```

4. **Configurar base de datos**
```bash
# Ejecutar migraciones
npx prisma migrate deploy

# Generar cliente Prisma
npx prisma generate
```

5. **Iniciar la aplicación**
```bash
npm run dev
```

6. **Acceder a la aplicación**
- Dashboard: http://localhost:3000
- Swagger Docs: http://localhost:3000/docs
- Health Check: http://localhost:3000/health

### Opción 2: Docker Compose (Recomendado)

```bash
# Levantar servicios (PostgreSQL + App)
docker compose up --build

# La aplicación estará disponible en http://localhost:3000
```

### Opción 3: Docker Hub (Pre-compilado)

```bash
# Crear red
docker network create projectinsight-net

# Levantar PostgreSQL
docker run -d \
  --name projectinsight-db \
  --network projectinsight-net \
  --network-alias postgres \
  -e POSTGRES_DB=pruebas \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -v projectinsight-data:/var/lib/postgresql/data \
  postgres:16-alpine

# Levantar aplicación desde Docker Hub
docker run -d \
  --name projectinsight-app \
  --network projectinsight-net \
  -p 3000:3000 \
  -e PORT=3000 \
  -e DATABASE_URL="postgresql://postgres:postgres@postgres:5432/pruebas" \
  juniorrdsr/prueba-tecnica:latest
```

---

## API REST - Endpoints

### 1. Crear Proyecto

**Request:**
```http
POST /api/proyectos
Content-Type: application/json

{
  "nombre": "Sistema de Inventario",
  "descripcion": "Sistema web para gestión de inventario en tiempo real",
  "estado": "EN_PROGRESO",
  "fechaInicio": "2025-01-10",
  "fechaFin": "2025-03-15"
}
```

**Response:**
```json
{
  "id": 1,
  "nombre": "Sistema de Inventario",
  "descripcion": "Sistema web para gestión de inventario en tiempo real",
  "estado": "EN_PROGRESO",
  "fechaInicio": "2025-01-10T00:00:00.000Z",
  "fechaFin": "2025-03-15T00:00:00.000Z"
}
```

### 2. Listar Proyectos

**Request:**
```http
GET /api/proyectos
```

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Sistema de Inventario",
    "descripcion": "Sistema web para gestión de inventario en tiempo real",
    "estado": "EN_PROGRESO",
    "fechaInicio": "2025-01-10T00:00:00.000Z",
    "fechaFin": "2025-03-15T00:00:00.000Z"
  },
  {
    "id": 2,
    "nombre": "App Móvil de Ventas",
    "descripcion": "Aplicación móvil para registro de ventas",
    "estado": "FINALIZADO",
    "fechaInicio": "2024-11-01T00:00:00.000Z",
    "fechaFin": "2025-01-05T00:00:00.000Z"
  }
]
```

### 3. Obtener Proyecto por ID

**Request:**
```http
GET /api/proyectos/1
```

**Response:**
```json
{
  "id": 1,
  "nombre": "Sistema de Inventario",
  "descripcion": "Sistema web para gestión de inventario en tiempo real",
  "estado": "EN_PROGRESO",
  "fechaInicio": "2025-01-10T00:00:00.000Z",
  "fechaFin": "2025-03-15T00:00:00.000Z"
}
```

### 4. Actualizar Proyecto

**Request:**
```http
PUT /api/proyectos/1
Content-Type: application/json

{
  "estado": "FINALIZADO",
  "fechaFin": "2025-02-20"
}
```

**Response:**
```json
{
  "id": 1,
  "nombre": "Sistema de Inventario",
  "descripcion": "Sistema web para gestión de inventario en tiempo real",
  "estado": "FINALIZADO",
  "fechaInicio": "2025-01-10T00:00:00.000Z",
  "fechaFin": "2025-02-20T00:00:00.000Z"
}
```

### 5. Eliminar Proyecto

**Request:**
```http
DELETE /api/proyectos/1
```

**Response:**
```http
204 No Content
```

### 6. Datos para Gráficos

**Request:**
```http
GET /api/graficos
```

**Response:**
```json
{
  "labels": ["EN_PROGRESO", "FINALIZADO", "PENDIENTE"],
  "data": [5, 12, 3],
  "total": 20
}
```

### 7. Análisis con IA

**Request:**
```http
GET /api/analisis
```

**Response (con API Key - SSE):**
```
data: {"chunk": "# Análisis de Proyectos\n\n"}
data: {"chunk": "## Resumen General\n"}
data: {"chunk": "Actualmente hay 20 proyectos..."}
data: {"done": true}
```

**Response (sin API Key - JSON):**
```json
{
  "resumen": "Análisis de 20 proyectos registrados",
  "proyectos": 20,
  "enProgreso": 5,
  "finalizados": 12,
  "pendientes": 3,
  "estadisticas": {
    "promedioDescripcion": 85,
    "proyectoMasReciente": "Sistema de Inventario"
  }
}
```

---

## Integración con IA

### Funcionamiento

1. **Con API Key (DeepSeek)**:
   - El usuario hace clic en "Generar resumen"
   - Frontend abre conexión SSE a `/api/analisis`
   - Backend envía prompt a DeepSeek con descripción de proyectos
   - Respuesta se transmite en chunks en tiempo real
   - Frontend renderiza markdown progresivamente

2. **Sin API Key (Fallback)**:
   - Backend devuelve JSON con estadísticas calculadas localmente
   - Frontend muestra resumen básico sin IA

### Prompt Utilizado

```javascript
const prompt = `
Analiza los siguientes proyectos y genera un resumen ejecutivo:

${proyectos.map(p => `
- ${p.nombre}: ${p.descripcion}
  Estado: ${p.estado}
  Inicio: ${p.fechaInicio} | Fin: ${p.fechaFin}
`).join('\n')}

Proporciona:
1. Resumen general
2. Proyectos destacados
3. Recomendaciones
`;
```

### Configuración

```bash
# Obtener API Key gratuita en: https://platform.deepseek.com
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxx
```

---

## Frontend Responsivo

### Diseño Desktop

El dashboard incluye:
- **Header**: Logo y título de la aplicación
- **KPIs Row**: 3 cards con métricas principales
- **Content Row**:
  - Columna izquierda (8 cols): Tabla de proyectos
  - Columna derecha (4 cols): Gráfico de distribución
- **AI Panel**: Sección para generar y mostrar resumen IA
- **Modales**: Crear/Editar proyecto

### Diseño Móvil

- **Layout de 1 columna**: Todo el contenido apilado verticalmente
- **KPIs**: Cards apiladas
- **Tabla**: Scroll horizontal en dispositivos pequeños
- **Gráfico**: Tamaño reducido pero legible
- **Modales**: Formularios adaptados a pantalla pequeña

### Breakpoints Utilizados

```css
/* Bootstrap 5 breakpoints */
- xs: <576px (móviles)
- sm: ≥576px (móviles grandes)
- md: ≥768px (tablets)
- lg: ≥992px (desktop pequeño)
- xl: ≥1200px (desktop)
- xxl: ≥1400px (desktop grande)
```

### Características Responsive

- Grid system de Bootstrap
- Cards adaptativas
- Tabla con scroll horizontal
- Formularios con validación
- Modales fullscreen en móviles
- Gráficos responsivos con Chart.js

---

## Docker y Despliegue

### Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Instalar netcat para healthcheck
RUN apk add --no-cache netcat-openbsd

# Copiar código fuente
COPY prisma ./prisma
COPY src ./src
COPY docker/entrypoint.sh ./entrypoint.sh

# Generar cliente Prisma
ARG DATABASE_URL=postgresql://postgres:postgres@postgres:5432/pruebas
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

# Configuración
ENV NODE_ENV=production
ENV PORT=3000
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
```

### Entrypoint Script

```bash
#!/bin/sh
set -e

# Esperar a que PostgreSQL esté listo
until nc -z -v -w30 postgres 5432; do
  echo "Esperando PostgreSQL..."
  sleep 1
done

# Ejecutar migraciones
echo "Ejecutando migraciones..."
npx prisma migrate deploy

# Iniciar aplicación
echo "Iniciando aplicación..."
exec node src/app.js
```

### Docker Compose

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: pruebas
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    environment:
      PORT: 3000
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/pruebas
      DEEPSEEK_API_KEY: ${DEEPSEEK_API_KEY:-}
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres-data:
```

### Publicación en Docker Hub

```bash
# Build
docker build -t juniorrdsr/prueba-tecnica:latest .

# Login
docker login

# Push
docker push juniorrdsr/prueba-tecnica:latest
```

---

## Evidencias Visuales

### Dashboard Desktop

![Vista principal del dashboard](screenshots/image.png)

**Características visibles:**
- KPIs con métricas en tiempo real
- Tabla de proyectos con acciones
- Gráfico de distribución por estado
- Panel de análisis con IA
- Interfaz oscura profesional

### Documentación Swagger

![Swagger UI](screenshots/image2.png)

**Características visibles:**
- Todos los endpoints documentados
- Esquemas de datos definidos
- Interfaz interactiva para probar API
- Ejemplos de request/response

### Modal de Creación

![Formulario de proyecto](screenshots/image3.png)

**Características visibles:**
- Validación de campos
- Selector de estado
- Date pickers para fechas
- Diseño consistente con el dashboard

### Vista Móvil (Samsung S20 Ultra)

![Vista móvil](screenshots/image4.png)

**Características visibles:**
- Layout de 1 columna adaptativo
- KPIs apilados
- Tabla con scroll horizontal
- Gráfico reducido pero legible
- Navegación optimizada para táctil

---

## Resultados y Cumplimiento

### Checklist de Requerimientos

| Requerimiento | Estado | Evidencia |
|---------------|--------|-----------|
| API REST con CRUD | [X] Completo | 5 endpoints + validaciones |
| PostgreSQL con ORM | [X] Completo | Prisma + Migraciones |
| Documentación Swagger | [X] Completo | `/docs` con OpenAPI 3.0 |
| Integración IA | [X] Completo | DeepSeek + fallback |
| Frontend responsivo | [X] Completo | Desktop + Móvil |
| Tablas y gráficos | [X] Completo | Chart.js + tabla dinámica |
| Docker | [X] Plus | Dockerfile + Compose + Hub |
| Documentación completa | [X] Completo | README + Este documento |

### Plus Implementados

1. [X] **Docker completo**: Dockerfile, docker-compose.yml, imagen en Docker Hub
2. [X] **Arquitectura modular**: Separación clara de capas (controllers, services, routes)
3. [X] **Manejo de errores**: Middleware centralizado con logging
4. [X] **Validaciones robustas**: En todas las operaciones CRUD
5. [X] **SSE para IA**: Streaming en tiempo real de respuestas
6. [X] **Fallback sin IA**: Sistema funciona sin API Key
7. [X] **Dark theme**: Interfaz profesional con Bootstrap
8. [X] **Healthcheck**: Endpoint de monitoreo

---

## Conclusiones

### Logros Técnicos

1. **Arquitectura sólida**: El proyecto sigue patrones de diseño reconocidos (MVC, separación de capas)
2. **Código limpio**: Código legible, comentado y bien estructurado
3. **Escalabilidad**: Fácil agregar nuevas funcionalidades sin romper código existente
4. **Experiencia de usuario**: Frontend intuitivo y responsivo
5. **DevOps**: Despliegue simplificado con Docker

### Decisiones Destacadas

1. **Prisma ORM**: Mejor DX que Sequelize, con type-safety
2. **SSE para IA**: Mejor UX que esperar respuesta completa
3. **Bootstrap 5**: Desarrollo rápido con diseño profesional
4. **Swagger**: Documentación viva y actualizada
5. **Docker Hub**: Facilita testing sin compilar localmente

### Aprendizajes

1. **Integración con APIs de IA**: Manejo de streaming y fallbacks
2. **Server-Sent Events**: Implementación de comunicación unidireccional en tiempo real
3. **Prisma avanzado**: Migraciones, relaciones, validaciones
4. **Docker multi-stage**: Optimización de imágenes
5. **Frontend vanilla**: Desarrollo sin frameworks pesados

### Tiempo de Desarrollo

- **Backend (API + DB)**: ~4 horas
- **Frontend (UI)**: ~3 horas
- **Integración IA**: ~2 horas
- **Docker**: ~1 hora
- **Documentación**: ~2 horas
- **Total**: ~12 horas

### Posibles Mejoras Futuras

1. **Testing**: Agregar pruebas unitarias y de integración (Jest, Supertest)
2. **Autenticación**: Implementar JWT para proteger endpoints
3. **Paginación**: Para listado de proyectos cuando crezca la base de datos
4. **WebSockets**: Para actualización en tiempo real de múltiples clientes
5. **CI/CD**: Pipeline automático con GitHub Actions
6. **Monitoring**: Logs centralizados y métricas (Prometheus, Grafana)

---

## Contacto

**Junior Rodriguez**  
**Email**: [correo del candidato]  
**GitHub**: https://github.com/JUNIORRDSR  
**LinkedIn**: [perfil de LinkedIn]

---

## Licencia

Este proyecto fue desarrollado como parte de una prueba técnica para GLocation.

---

**Nota Final**: Este documento evidencia la implementación completa de todos los requerimientos solicitados en la prueba técnica. El código está disponible en el repositorio de GitHub y la aplicación puede ser desplegada fácilmente usando Docker. Estoy disponible para una sesión técnica donde pueda demostrar el funcionamiento del sistema en localhost y responder cualquier pregunta sobre la implementación.
