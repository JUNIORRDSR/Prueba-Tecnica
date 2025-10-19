import prisma from '../db/prismaClient.js';

export async function crearProyecto(data) {
  return prisma.proyecto.create({ data });
}

export async function listarProyectos() {
  return prisma.proyecto.findMany({ orderBy: { id: 'desc' } });
}

export async function obtenerProyectoPorId(id) {
  return prisma.proyecto.findUnique({ where: { id } });
}

export async function actualizarProyecto(id, data) {
  try {
    return await prisma.proyecto.update({ where: { id }, data });
  } catch (e) {
    if (e.code === 'P2025') { // Prisma: record not found
      const err = new Error('Proyecto no encontrado');
      err.status = 404; throw err;
    }
    throw e;
  }
}

export async function eliminarProyecto(id) {
  try {
    await prisma.proyecto.delete({ where: { id } });
  } catch (e) {
    if (e.code === 'P2025') {
      const err = new Error('Proyecto no encontrado');
      err.status = 404; throw err;
    }
    throw e;
  }
}
