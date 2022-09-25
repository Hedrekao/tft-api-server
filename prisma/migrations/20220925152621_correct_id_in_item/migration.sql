/*
  Warnings:

  - The primary key for the `items_ranking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `items_ranking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "items_ranking" DROP CONSTRAINT "items_ranking_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "items_ranking_pkey" PRIMARY KEY ("id");
