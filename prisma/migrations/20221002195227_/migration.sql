-- DropForeignKey
ALTER TABLE "augments" DROP CONSTRAINT "augments_compid_fkey";

-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_unithexid_fkey";

-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_unitid_fkey";

-- DropForeignKey
ALTER TABLE "itemunit" DROP CONSTRAINT "itemunit_unititemid_fkey";

-- DropForeignKey
ALTER TABLE "traits" DROP CONSTRAINT "traits_compid_fkey";

-- DropForeignKey
ALTER TABLE "traits" DROP CONSTRAINT "traits_variationid_fkey";

-- DropForeignKey
ALTER TABLE "unit" DROP CONSTRAINT "unit_compid_fkey";

-- DropForeignKey
ALTER TABLE "unit" DROP CONSTRAINT "unit_variationid_fkey";

-- DropForeignKey
ALTER TABLE "unithex" DROP CONSTRAINT "unithex_compid_fkey";

-- DropForeignKey
ALTER TABLE "unititems" DROP CONSTRAINT "unititems_compid_fkey";

-- DropForeignKey
ALTER TABLE "variation" DROP CONSTRAINT "variation_compid_fkey";

-- CreateTable
CREATE TABLE "compositionJSON" (
    "id" BIGSERIAL NOT NULL,
    "json" JSON,

    CONSTRAINT "compositionJSON_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "augments" ADD CONSTRAINT "augments_compid_fkey" FOREIGN KEY ("compid") REFERENCES "composition"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_unithexid_fkey" FOREIGN KEY ("unithexid") REFERENCES "unithex"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_unitid_fkey" FOREIGN KEY ("unitid") REFERENCES "unit"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "itemunit" ADD CONSTRAINT "itemunit_unititemid_fkey" FOREIGN KEY ("unititemid") REFERENCES "unititems"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "traits" ADD CONSTRAINT "traits_compid_fkey" FOREIGN KEY ("compid") REFERENCES "composition"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "traits" ADD CONSTRAINT "traits_variationid_fkey" FOREIGN KEY ("variationid") REFERENCES "variation"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit" ADD CONSTRAINT "unit_compid_fkey" FOREIGN KEY ("compid") REFERENCES "composition"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit" ADD CONSTRAINT "unit_variationid_fkey" FOREIGN KEY ("variationid") REFERENCES "variation"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unithex" ADD CONSTRAINT "unithex_compid_fkey" FOREIGN KEY ("compid") REFERENCES "composition"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unititems" ADD CONSTRAINT "unititems_compid_fkey" FOREIGN KEY ("compid") REFERENCES "composition"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "variation" ADD CONSTRAINT "variation_compid_fkey" FOREIGN KEY ("compid") REFERENCES "composition"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
