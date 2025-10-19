import { Router } from 'express';
import * as controller from '../controllers/proyectos.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Proyectos
 *   description: Gestión de proyectos
 */

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
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Proyectos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProyectoInput'
 *     responses:
 *       201:
 *         description: Proyecto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proyecto'
 *
 * /api/proyectos/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proyecto'
 *       404:
 *         description: Proyecto no encontrado
 *   put:
 *     summary: Actualizar un proyecto
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProyectoInput'
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proyecto'
 *       404:
 *         description: Proyecto no encontrado
 *   delete:
 *     summary: Eliminar un proyecto
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proyecto
 *     responses:
 *       204:
 *         description: Proyecto eliminado
 *       404:
 *         description: Proyecto no encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Proyecto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *         descripcion:
 *           type: string
 *         estado:
 *           type: string
 *           enum: [EN_PROGRESO, FINALIZADO, PENDIENTE]
 *         fechaInicio:
 *           type: string
 *           format: date-time
 *         fechaFin:
 *           type: string
 *           format: date-time
 *           nullable: true
	*     ProyectoInput:
	*       type: object
	*       required: [nombre, estado, fechaInicio]
	*       properties:
	*         nombre:
	*           type: string
	*           example: Rediseño portal corporativo
	*         descripcion:
	*           type: string
	*           example: Actualización completa del portal web y CMS.
	*         estado:
	*           type: string
	*           enum: [EN_PROGRESO, FINALIZADO, PENDIENTE]
	*           example: EN_PROGRESO
	*         fechaInicio:
	*           type: string
	*           format: date-time
	*           example: 2025-10-01T00:00:00.000Z
	*         fechaFin:
	*           type: string
	*           format: date-time
	*           nullable: true
	*           example: 2025-11-15T00:00:00.000Z
 */

router.post('/', controller.crearProyecto);
router.get('/', controller.listarProyectos);
router.get('/:id', controller.obtenerProyecto);
router.put('/:id', controller.actualizarProyecto);
router.delete('/:id', controller.eliminarProyecto);

export default router;
