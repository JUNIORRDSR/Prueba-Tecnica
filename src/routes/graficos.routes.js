import { Router } from 'express';
import { obtenerDistribucionEstados } from '../controllers/graficos.controller.js';

/**
 * @swagger
 * tags:
 *   name: Graficos
 *   description: Datos agregados para gráficos
 */

/**
 * @swagger
 * /api/graficos:
 *   get:
 *     summary: Obtener cantidad de proyectos por estado
 *     tags: [Graficos]
 *     responses:
 *       200:
 *         description: Datos para gráfico de barras o torta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 labels:
 *                   type: array
 *                   items:
 *                     type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: integer
 */

const router = Router();
router.get('/', obtenerDistribucionEstados);
export default router;
