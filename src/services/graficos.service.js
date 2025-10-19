import prisma from '../db/prismaClient.js';

export async function contarProyectosPorEstado() {
  const proyectos = await prisma.proyecto.findMany({ select: { estado: true } });
  const counts = { EN_PROGRESO: 0, FINALIZADO: 0, PENDIENTE: 0 };
  for (const p of proyectos) {
    if (counts[p.estado] !== undefined) counts[p.estado]++;
  }
  return counts;
}
