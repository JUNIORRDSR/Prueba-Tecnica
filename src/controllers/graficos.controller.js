import { contarProyectosPorEstado } from '../services/graficos.service.js';

export async function obtenerDistribucionEstados(_req, res, next) {
  try {
    const counts = await contarProyectosPorEstado();
    const labels = Object.keys(counts);
    const data = Object.values(counts);
    res.json({ labels, data });
  } catch (err) { next(err); }
}
