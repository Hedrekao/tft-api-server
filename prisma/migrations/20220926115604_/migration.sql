/*
  Warnings:

  - The primary key for the `general_data` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `general_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "general_data" DROP CONSTRAINT "general_data_pkey",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "general_data_pkey" PRIMARY KEY ("id");
