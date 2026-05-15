-- CreateTable
CREATE TABLE "Lead" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "faturamento" TEXT NOT NULL,
    "colaboradores" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);
