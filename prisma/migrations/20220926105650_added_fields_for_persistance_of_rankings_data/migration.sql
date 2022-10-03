-- AlterTable
ALTER TABLE "augments_ranking" ADD COLUMN     "numberOfAppearances" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "sumOfPlacements" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "sumOfWins" BIGINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "champions_ranking" ADD COLUMN     "numberOfAppearances" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "sumOfPlacements" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "sumOfWins" BIGINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "items_ranking" ADD COLUMN     "numberOfAppearances" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "sumOfPlacements" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "sumOfWins" BIGINT NOT NULL DEFAULT 0;
