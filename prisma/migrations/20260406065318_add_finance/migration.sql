-- CreateTable
CREATE TABLE "Finance" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "income" INTEGER NOT NULL,
    "expense" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Finance_pkey" PRIMARY KEY ("id")
);
