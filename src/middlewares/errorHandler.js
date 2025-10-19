export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  if (status >= 500) {
    console.error('Error 500:', err);
  }
  res.status(status).json({ error: true, message });
}
