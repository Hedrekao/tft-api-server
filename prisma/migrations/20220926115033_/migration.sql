/*
  Warnings:

  - You are about to alter the column `numberOfAppearances` on the `augments_ranking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `sumOfPlacements` on the `augments_ranking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `sumOfWins` on the `augments_ranking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `numberOfAppearances` on the `champions_ranking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `sumOfPlacements` on the `champions_ranking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `sumOfWins` on the `champions_ranking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - The primary key for the `general_data` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `totalNumberOfMatches` on the `general_data` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `numberOfAppearances` on the `items_ranking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `sumOfPlacements` on the `items_ranking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `sumOfWins` on the `items_ranking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "augments_ranking" ALTER COLUMN "numberOfAppearances" SET DEFAULT 0,
ALTER COLUMN "numberOfAppearances" SET DATA TYPE INTEGER,
ALTER COLUMN "sumOfPlacements" SET DEFAULT 0,
ALTER COLUMN "sumOfPlacements" SET DATA TYPE INTEGER,
ALTER COLUMN "sumOfWins" SET DEFAULT 0,
ALTER COLUMN "sumOfWins" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "champions_ranking" ALTER COLUMN "numberOfAppearances" SET DEFAULT 0,
ALTER COLUMN "numberOfAppearances" SET DATA TYPE INTEGER,
ALTER COLUMN "sumOfPlacements" SET DEFAULT 0,
ALTER COLUMN "sumOfPlacements" SET DATA TYPE INTEGER,
ALTER COLUMN "sumOfWins" SET DEFAULT 0,
ALTER COLUMN "sumOfWins" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "general_data" DROP CONSTRAINT "general_data_pkey",
ALTER COLUMN "totalNumberOfMatches" SET DATA TYPE INTEGER,
ADD CONSTRAINT "general_data_pkey" PRIMARY KEY ("totalNumberOfMatches");

-- AlterTable
ALTER TABLE "items_ranking" ALTER COLUMN "numberOfAppearances" SET DEFAULT 0,
ALTER COLUMN "numberOfAppearances" SET DATA TYPE INTEGER,
ALTER COLUMN "sumOfPlacements" SET DEFAULT 0,
ALTER COLUMN "sumOfPlacements" SET DATA TYPE INTEGER,
ALTER COLUMN "sumOfWins" SET DEFAULT 0,
ALTER COLUMN "sumOfWins" SET DATA TYPE INTEGER;
