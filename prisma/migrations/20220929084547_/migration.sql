/*
  Warnings:

  - The primary key for the `item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `unithex` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cost` on the `variation` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `variation` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `variation` table. All the data in the column will be lost.
  - You are about to drop the column `xposition` on the `variation` table. All the data in the column will be lost.
  - You are about to drop the column `yposition` on the `variation` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unithexid` to the `item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idGiven` to the `unithex` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE "item_id_seq";
ALTER TABLE "item" DROP CONSTRAINT "item_pkey",
ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD COLUMN     "unithexid" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('item_id_seq'),
ADD CONSTRAINT "item_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE "item_id_seq" OWNED BY "item"."id";

-- AlterTable
CREATE SEQUENCE "unithex_id_seq";
ALTER TABLE "unithex" DROP CONSTRAINT "unithex_pkey",
ADD COLUMN     "idGiven" INTEGER NOT NULL,
ADD COLUMN     "level" INTEGER,
ALTER COLUMN "id" SET DEFAULT nextval('unithex_id_seq'),
ADD CONSTRAINT "unithex_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE "unithex_id_seq" OWNED BY "unithex"."id";

-- AlterTable
ALTER TABLE "variation" DROP COLUMN "cost",
DROP COLUMN "name",
DROP COLUMN "url",
DROP COLUMN "xposition",
DROP COLUMN "yposition",
ADD COLUMN     "avgPlacement" DECIMAL,
ADD COLUMN     "top4Ratio" DECIMAL;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_unithexid_fkey" FOREIGN KEY ("unithexid") REFERENCES "unithex"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
