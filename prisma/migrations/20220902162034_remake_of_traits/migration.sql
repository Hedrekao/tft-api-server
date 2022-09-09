/*
  Warnings:

  - You are about to drop the column `description` on the `augments` table. All the data in the column will be lost.
  - You are about to drop the column `rarity` on the `augments` table. All the data in the column will be lost.
  - You are about to drop the column `isthreestar` on the `champions_composition` table. All the data in the column will be lost.
  - You are about to drop the column `isorigin` on the `traits` table. All the data in the column will be lost.
  - Made the column `name` on table `augments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `avg_place` on table `augments_composition` required. This step will fail if there are existing NULL values in that column.
  - Made the column `winrate` on table `augments_composition` required. This step will fail if there are existing NULL values in that column.
  - Made the column `frequency` on table `augments_composition` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `number_of_games_played` to the `champions_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `max_trait` to the `traits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "augments" DROP COLUMN "description",
DROP COLUMN "rarity",
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "augments_composition" ALTER COLUMN "avg_place" SET NOT NULL,
ALTER COLUMN "winrate" SET NOT NULL,
ALTER COLUMN "frequency" SET NOT NULL;

-- AlterTable
ALTER TABLE "champions_composition" DROP COLUMN "isthreestar",
ADD COLUMN     "is_three_star" BOOLEAN;

-- AlterTable
ALTER TABLE "champions_items" ADD COLUMN     "number_of_games_played" INTEGER NOT NULL;

-- AlterTable
CREATE SEQUENCE "compositions_id_seq";
ALTER TABLE "compositions" ALTER COLUMN "id" SET DEFAULT nextval('compositions_id_seq');
ALTER SEQUENCE "compositions_id_seq" OWNED BY "compositions"."id";

-- AlterTable
ALTER TABLE "traits" DROP COLUMN "isorigin",
ADD COLUMN     "max_trait" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "traits_composition" (
    "trait_id" TEXT NOT NULL,
    "composition_id" INTEGER NOT NULL,
    "style" INTEGER NOT NULL,
    "current_trait" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "traits_composition_pkey" PRIMARY KEY ("trait_id","composition_id")
);

-- AddForeignKey
ALTER TABLE "traits_composition" ADD CONSTRAINT "traits_composition_trait_id_fkey" FOREIGN KEY ("trait_id") REFERENCES "traits"("name") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "traits_composition" ADD CONSTRAINT "traits_composition_composition_id_fkey" FOREIGN KEY ("composition_id") REFERENCES "compositions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
