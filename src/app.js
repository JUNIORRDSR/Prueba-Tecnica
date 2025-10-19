import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import proyectosRouter from './routes/proyectos.routes.js';
import graficosRouter from './routes/graficos.routes.js';
import analisisRouter from './routes/analisis.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupSwagger } from './swagger.js';

dotenv.config();

const app = express();

// Middlewares base
app.use(express.json());
app.use(cors());

// Logger simple (Se puede borrar mas tarde)
app.use((req, _res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
	next();
});

// Healthcheck
app.get('/health', (_req, res) => {
	res.status(200).json({ ok: true, service: 'api', timestamp: new Date().toISOString() });
});

// Configurar motor de vistas EJS para SSR
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// Configurar Swagger en /docs
setupSwagger(app);

// Rutas web SSR (placeholder): home lista proyectos
app.get('/', (_req, res) => {
	res.render('index');
});

// Rutas de la API
app.use('/api/proyectos', proyectosRouter);
app.use('/api/graficos', graficosRouter);
app.use('/api/analisis', analisisRouter);

// 404 handler
app.use((req, res, next) => {
	if (res.headersSent) return next();
	res.status(404).json({ error: true, message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Error handler global
app.use(errorHandler);


const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
