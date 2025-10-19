#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL no está definido" >&2
  exit 1
fi

host="postgres"
port="5432"

if [ -n "$POSTGRES_HOST" ]; then
  host="$POSTGRES_HOST"
fi

if [ -n "$POSTGRES_PORT" ]; then
  port="$POSTGRES_PORT"
fi

echo "Esperando a PostgreSQL en ${host}:${port}..."
while ! nc -z "$host" "$port" >/dev/null 2>&1; do
  sleep 1
  echo "PostgreSQL aún no está listo..."
done

echo "Base de datos lista. Aplicando migraciones..."
npx prisma migrate deploy --schema prisma/schema.prisma

echo "Iniciando servidor..."
exec node src/app.js
