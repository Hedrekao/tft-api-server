-- AlterTable
ALTER TABLE "augments_ranking" ALTER COLUMN "numberOfAppearances" SET DEFAULT 0,
ALTER COLUMN "numberOfAppearances" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "sumOfPlacements" SET DEFAULT 0,
ALTER COLUMN "sumOfPlacements" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "sumOfWins" SET DEFAULT 0,
ALTER COLUMN "sumOfWins" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "champions_ranking" ALTER COLUMN "numberOfAppearances" SET DEFAULT 0,
ALTER COLUMN "numberOfAppearances" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "sumOfPlacements" SET DEFAULT 0,
ALTER COLUMN "sumOfPlacements" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "sumOfWins" SET DEFAULT 0,
ALTER COLUMN "sumOfWins" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "items_ranking" ALTER COLUMN "numberOfAppearances" SET DEFAULT 0,
ALTER COLUMN "numberOfAppearances" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "sumOfPlacements" SET DEFAULT 0,
ALTER COLUMN "sumOfPlacements" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "sumOfWins" SET DEFAULT 0,
ALTER COLUMN "sumOfWins" SET DATA TYPE DECIMAL(65,30);

-- CreateTable
CREATE TABLE "general_data" (
    "totalNumberOfMatches" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "general_data_pkey" PRIMARY KEY ("totalNumberOfMatches")
);
