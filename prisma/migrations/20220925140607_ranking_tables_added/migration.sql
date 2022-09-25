/*
  Warnings:

  - You are about to drop the `augments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `augments_composition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `champions_composition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `champions_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `champions_traits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `compositions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `general_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `traits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `traits_composition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "augments_composition" DROP CONSTRAINT "augments_composition_augment_id_fkey";

-- DropForeignKey
ALTER TABLE "augments_composition" DROP CONSTRAINT "augments_composition_composition_id_fkey";

-- DropForeignKey
ALTER TABLE "champions_composition" DROP CONSTRAINT "champions_composition_champion_id_fkey";

-- DropForeignKey
ALTER TABLE "champions_composition" DROP CONSTRAINT "champions_composition_composition_id_fkey";

-- DropForeignKey
ALTER TABLE "champions_items" DROP CONSTRAINT "champions_items_champion_id_fkey";

-- DropForeignKey
ALTER TABLE "champions_items" DROP CONSTRAINT "champions_items_item_id_fkey";

-- DropForeignKey
ALTER TABLE "champions_traits" DROP CONSTRAINT "champions_traits_champion_id_fkey";

-- DropForeignKey
ALTER TABLE "champions_traits" DROP CONSTRAINT "champions_traits_trait_id_fkey";

-- DropForeignKey
ALTER TABLE "traits_composition" DROP CONSTRAINT "traits_composition_composition_id_fkey";

-- DropForeignKey
ALTER TABLE "traits_composition" DROP CONSTRAINT "traits_composition_trait_id_fkey";

-- DropTable
DROP TABLE "augments";

-- DropTable
DROP TABLE "augments_composition";

-- DropTable
DROP TABLE "champions_composition";

-- DropTable
DROP TABLE "champions_items";

-- DropTable
DROP TABLE "champions_traits";

-- DropTable
DROP TABLE "compositions";

-- DropTable
DROP TABLE "general_data";

-- DropTable
DROP TABLE "items";

-- DropTable
DROP TABLE "traits";

-- DropTable
DROP TABLE "traits_composition";

-- CreateTable
CREATE TABLE "champions_ranking" (
    "id" VARCHAR NOT NULL,
    "avg_place" DECIMAL NOT NULL,
    "winrate" DECIMAL NOT NULL,
    "frequency" DECIMAL NOT NULL,

    CONSTRAINT "champions_ranking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_ranking" (
    "id" VARCHAR NOT NULL,
    "avg_place" DECIMAL NOT NULL,
    "winrate" DECIMAL NOT NULL,
    "frequency" DECIMAL NOT NULL,

    CONSTRAINT "items_ranking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "augments_ranking" (
    "id" VARCHAR NOT NULL,
    "avg_place" DECIMAL NOT NULL,
    "winrate" DECIMAL NOT NULL,
    "frequency" DECIMAL NOT NULL,

    CONSTRAINT "augments_ranking_pkey" PRIMARY KEY ("id")
);
