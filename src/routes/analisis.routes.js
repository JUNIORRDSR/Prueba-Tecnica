import { Router } from 'express';
import { generarAnalisis } from '../controllers/analisis.controller.js';

/**
 * @swagger
 * tags:
 *   name: Analisis
 *   description: Resumen IA generativa de proyectos
 */

/**
 * @swagger
 * /api/analisis:
 *   get:
 *     summary: Generar resumen de proyectos usando IA generativa
 *     tags: [Analisis]
 *     responses:
 *       200:
 *         description: Flujo SSE con fragmentos del resumen IA. Si no hay clave de IA se devuelve un JSON con el resumen generado localmente.
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *               example: |
 *                 data: {"chunk":"Resumen parcial"}
 *
 *                 data: {"done":true,"resumen":"Resumen final"}
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resumen:
 *                   type: string
 *                   example: 'Total proyectos: 3. Distribución por estado: {"EN_PROGRESO":2,"FINALIZADO":1}.'
 */

const router = Router();
router.get('/', generarAnalisis);
export default router;
