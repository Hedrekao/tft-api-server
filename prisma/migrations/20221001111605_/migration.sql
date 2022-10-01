/*
  Warnings:

  - You are about to alter the column `rate` on the `itemunit` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(4,1)`.

*/
-- AlterTable
ALTER TABLE "itemunit" ALTER COLUMN "rate" SET DATA TYPE DECIMAL(4,1);
