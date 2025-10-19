-- CreateTable
CREATE TABLE "Proyecto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("id")
);
