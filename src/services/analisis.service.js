import prisma from '../db/prismaClient.js';
import OpenAI from 'openai';

// Genera un resumen asistido por IA de todos los proyectos.
// Si no hay API key (DEEPSEEK_API_KEY), retorna un resumen local sencillo.
export async function resumenIA() {
  // 1) Obtener todos los proyectos con los campos relevantes
  const proyectos = await prisma.proyecto.findMany({
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      estado: true,
      fechaInicio: true,
      fechaFin: true,
    },
    orderBy: { id: 'asc' },
  });

  // 2) Armar un resumen local como fallback
  const total = proyectos.length;
  const porEstado = proyectos.reduce((acc, p) => {
    acc[p.estado] = (acc[p.estado] || 0) + 1;
    return acc;
  }, {});

  const textoDescripciones = proyectos
    .map((p) => (p.descripcion || '').trim())
    .filter(Boolean)
    .join(' ');

  const resumenLocal =
    total === 0
      ? 'No hay proyectos registrados aún.'
      : `Total proyectos: ${total}. Distribución por estado: ${JSON.stringify(porEstado)}. ` +
        (textoDescripciones
          ? `Resumen de descripciones: ${textoDescripciones.slice(0, 600)}${
              textoDescripciones.length > 600 ? '…' : ''
            }`
          : 'Sin descripciones disponibles.');

  // 3) Si no hay API key, devolvemos el fallback
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return resumenLocal;

  // 4) Preparar cliente y prompt para DeepSeek (vía OpenAI SDK)
  const openai = new OpenAI({ baseURL: 'https://api.deepseek.com', apiKey });

  // Preparar payload con fechas legibles y duración calculada
  const proyectosPayload = proyectos.slice(0, 200).map((p) => {
    const inicio = p.fechaInicio ? new Date(p.fechaInicio) : null;
    const fin = p.fechaFin ? new Date(p.fechaFin) : null;
    let duracionDias = null;
    if (inicio && fin) {
      duracionDias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
    }
    return {
      id: p.id,
      nombre: p.nombre,
      estado: p.estado,
      fechaInicio: inicio ? inicio.toLocaleDateString('es-ES') : null,
      fechaFin: fin ? fin.toLocaleDateString('es-ES') : null,
      duracionDias,
      descripcion: p.descripcion || '',
    };
  });

  const system =
    'Eres un asistente técnico senior en gestión de proyectos. ' +
    'Hablas en español de forma clara y concisa. Tu objetivo es ayudar a evaluar el estado del portafolio y proponer acciones. ' +
    'IMPORTANTE: Las fechas están en formato dd/mm/yyyy y la duración ya está calculada en días.';

  const user = `Aquí tienes la lista de proyectos con fechas en formato español (dd/mm/yyyy) y duración ya calculada en días.
Devuelve una respuesta (en formato de texto no markdown) breve pensada para ejecutivos y el equipo, con este formato:
1) Resumen general (1-2 líneas, menciona duraciones reales de los proyectos)
2) Métricas (total y por estado)
3) Riesgos/Bloqueos observados (basándote en duraciones cortas/largas, estados, fechas próximas)
4) Recomendaciones concretas (bullets, 2-3 máximo)
5) Próximos pasos (bullets, 2-3 máximo)

Sé específico con las fechas y duraciones. Si un proyecto dura 10 días, di "10 días", no inventes meses.

Proyectos:
${JSON.stringify(proyectosPayload, null, 2)}`;

  try {
    const stream = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.2,
      max_tokens: 600,
      stream: true,
    });

    // Retornamos el stream para que el controller lo consuma
    return stream;
  } catch (err) {
    // Si la llamada a IA falla, volvemos al fallback local
    console.error('Fallo en DeepSeek:', err?.message || err);
    return resumenLocal;
  }
}
