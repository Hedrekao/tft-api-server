/*
  Warnings:

  - You are about to alter the column `avgplacement` on the `composition` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(3,2)`.
  - You are about to alter the column `top4ratio` on the `composition` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(4,2)`.
  - You are about to alter the column `playrate` on the `composition` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(4,2)`.
  - You are about to alter the column `avgPlacement` on the `variation` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(3,2)`.
  - You are about to alter the column `top4Ratio` on the `variation` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(4,2)`.
  - Added the required column `idGiven` to the `unit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "composition" ALTER COLUMN "avgplacement" SET DATA TYPE DECIMAL(3,2),
ALTER COLUMN "top4ratio" SET DATA TYPE DECIMAL(4,2),
ALTER COLUMN "playrate" SET DATA TYPE DECIMAL(4,2);

-- AlterTable
ALTER TABLE "unit" ADD COLUMN     "idGiven" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "unithex" ALTER COLUMN "idGiven" SET DATA TYPE VARCHAR;

-- AlterTable
ALTER TABLE "variation" ALTER COLUMN "avgPlacement" SET DATA TYPE DECIMAL(3,2),
ALTER COLUMN "top4Ratio" SET DATA TYPE DECIMAL(4,2);
