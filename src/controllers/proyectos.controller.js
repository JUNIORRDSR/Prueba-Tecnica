import * as service from '../services/proyectos.service.js';

const estadosValidos = ['EN_PROGRESO', 'FINALIZADO', 'PENDIENTE'];

function parseId(param) {
  const id = Number(param);
  if (Number.isNaN(id)) {
    const err = new Error('ID inválido');
    err.status = 400;
    throw err;
  }
  return id;
}

export async function crearProyecto(req, res, next) {
  try {
    const { nombre, descripcion, estado, fechaInicio, fechaFin } = req.body;

    if (!nombre) {
      const err = new Error('El nombre es requerido');
      err.status = 400; throw err;
    }
    if (!estado || !estadosValidos.includes(estado)) {
      const err = new Error('Estado inválido. Use EN_PROGRESO | FINALIZADO | PENDIENTE');
      err.status = 400; throw err;
    }
    if (!fechaInicio) {
      const err = new Error('fechaInicio es requerida');
      err.status = 400; throw err;
    }
    if (fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
      const err = new Error('fechaFin no puede ser menor a fechaInicio');
      err.status = 400; throw err;
    }

    const proyecto = await service.crearProyecto({
      nombre,
      descripcion: descripcion ?? '',
      estado,
      fechaInicio: new Date(fechaInicio),
      fechaFin: fechaFin ? new Date(fechaFin) : null,
    });

    res.status(201).json(proyecto);
  } catch (err) { next(err); }
}

export async function listarProyectos(_req, res, next) {
  try {
    const proyectos = await service.listarProyectos();
    res.json(proyectos);
  } catch (err) { next(err); }
}

export async function obtenerProyecto(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const proyecto = await service.obtenerProyectoPorId(id);
    if (!proyecto) {
      const err = new Error('Proyecto no encontrado');
      err.status = 404; throw err;
    }
    res.json(proyecto);
  } catch (err) { next(err); }
}

export async function actualizarProyecto(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const { nombre, descripcion, estado, fechaInicio, fechaFin } = req.body;

    if (estado && !estadosValidos.includes(estado)) {
      const err = new Error('Estado inválido. Use EN_PROGRESO | FINALIZADO | PENDIENTE');
      err.status = 400; throw err;
    }
    if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
      const err = new Error('fechaFin no puede ser menor a fechaInicio');
      err.status = 400; throw err;
    }

    const data = {};
    if (nombre !== undefined) data.nombre = nombre;
    if (descripcion !== undefined) data.descripcion = descripcion;
    if (estado !== undefined) data.estado = estado;
    if (fechaInicio !== undefined) data.fechaInicio = new Date(fechaInicio);
    if (fechaFin !== undefined) data.fechaFin = fechaFin ? new Date(fechaFin) : null;

    const actualizado = await service.actualizarProyecto(id, data);
    res.json(actualizado);
  } catch (err) { next(err); }
}

export async function eliminarProyecto(req, res, next) {
  try {
    const id = parseId(req.params.id);
    await service.eliminarProyecto(id);
    res.status(204).send();
  } catch (err) { next(err); }
}
