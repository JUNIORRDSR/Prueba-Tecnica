import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT;
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Proyectos GLocation',
      version: '1.0.0',
      description: 'Documentación de la API para gestión de proyectos, análisis IA y gráficos.',
    },
    servers: [
      { url: `http://localhost:${PORT}`, description: 'Desarrollo local' }
    ],
  },
  apis: [
    path.join(__dirname, 'routes', '*.js')
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
