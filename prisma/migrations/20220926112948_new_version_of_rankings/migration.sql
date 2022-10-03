/*
  Warnings:

  - You are about to drop the column `avg_place` on the `augments_ranking` table. All the data in the column will be lost.
  - You are about to drop the column `frequency` on the `augments_ranking` table. All the data in the column will be lost.
  - You are about to drop the column `winrate` on the `augments_ranking` table. All the data in the column will be lost.
  - You are about to drop the column `avg_place` on the `champions_ranking` table. All the data in the column will be lost.
  - You are about to drop the column `frequency` on the `champions_ranking` table. All the data in the column will be lost.
  - You are about to drop the column `winrate` on the `champions_ranking` table. All the data in the column will be lost.
  - You are about to drop the column `avg_place` on the `items_ranking` table. All the data in the column will be lost.
  - You are about to drop the column `frequency` on the `items_ranking` table. All the data in the column will be lost.
  - You are about to drop the column `winrate` on the `items_ranking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "augments_ranking" DROP COLUMN "avg_place",
DROP COLUMN "frequency",
DROP COLUMN "winrate";

-- AlterTable
ALTER TABLE "champions_ranking" DROP COLUMN "avg_place",
DROP COLUMN "frequency",
DROP COLUMN "winrate";

-- AlterTable
ALTER TABLE "items_ranking" DROP COLUMN "avg_place",
DROP COLUMN "frequency",
DROP COLUMN "winrate";
