import { resumenIA } from '../services/analisis.service.js';

export async function generarAnalisis(_req, res, next) {
  try {
    const resultado = await resumenIA();
    
    // Si es un string (fallback local), enviamos JSON directo
    if (typeof resultado === 'string') {
      return res.json({ resumen: resultado });
    }

    // Si es un stream de DeepSeek, enviamos Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let contenidoCompleto = '';

    for await (const chunk of resultado) {
      const texto = chunk.choices?.[0]?.delta?.content || '';
      if (texto) {
        contenidoCompleto += texto;
        // Enviar chunk al cliente
        res.write(`data: ${JSON.stringify({ chunk: texto })}\n\n`);
      }
    }

    // Enviar evento final con el texto completo
    res.write(`data: ${JSON.stringify({ done: true, resumen: contenidoCompleto })}\n\n`);
    res.end();
  } catch (err) { next(err); }
}
