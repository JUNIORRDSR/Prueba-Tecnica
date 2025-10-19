// Importar PrismaClient
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
// Crear una instancia única (singleton)
const prisma = new PrismaClient();

// Exportarla para reutilizarla en servicios
export default prisma;
