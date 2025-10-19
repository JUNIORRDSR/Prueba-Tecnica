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
 *         description: Resumen generado por IA o fallback local
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resumen:
 *                   type: string
 */

const router = Router();
router.get('/', generarAnalisis);
export default router;
