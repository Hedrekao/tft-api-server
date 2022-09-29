-- CreateTable
CREATE TABLE "augments" (
    "src" VARCHAR,
    "name" VARCHAR NOT NULL,
    "avgplacement" DECIMAL,
    "winrate" DECIMAL,
    "frequency" DECIMAL,
    "compid" INTEGER NOT NULL,

    CONSTRAINT "augments_pkey" PRIMARY KEY ("name","compid")
);

-- CreateTable
CREATE TABLE "composition" (
    "id" SERIAL NOT NULL,
    "avgplacement" DECIMAL,
    "top4ratio" DECIMAL,
    "playrate" DECIMAL,

    CONSTRAINT "composition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR,
    "url" VARCHAR,
    "unitid" INTEGER NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id","unitid")
);

-- CreateTable
CREATE TABLE "itemunit" (
    "src" VARCHAR NOT NULL,
    "name" VARCHAR,
    "rate" DECIMAL,
    "isbis" BOOLEAN NOT NULL,
    "unititemid" INTEGER NOT NULL,

    CONSTRAINT "itemunit_pkey" PRIMARY KEY ("src","unititemid","isbis")
);

-- CreateTable
CREATE TABLE "traits" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "currenttrait" INTEGER,
    "traitstyle" INTEGER,
    "url" VARCHAR,
    "variationid" INTEGER,
    "compid" INTEGER,

    CONSTRAINT "traits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "url" VARCHAR,
    "cost" INTEGER,
    "level" INTEGER,
    "variationid" INTEGER,
    "compid" INTEGER,

    CONSTRAINT "unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unithex" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR,
    "cost" INTEGER,
    "url" VARCHAR,
    "xposition" INTEGER,
    "yposition" INTEGER,
    "compid" INTEGER NOT NULL,

    CONSTRAINT "unithex_pkey" PRIMARY KEY ("id","compid")
);

-- CreateTable
CREATE TABLE "unititems" (
    "id" SERIAL NOT NULL,
    "unitname" VARCHAR,
    "unitsrc" VARCHAR,
    "cost" INTEGER,
    "compid" INTEGER,

    CONSTRAINT "unititems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variation" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "cost" INTEGER,
    "url" VARCHAR,
    "xposition" INTEGER,
    "yposition" INTEGER,
    "compid" INTEGER,

    CONSTRAINT "variation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "augments" ADD CONSTRAINT "augments_compid_fkey" FOREIGN KEY ("compid") REFERENCES "composition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_unitid_fkey" FOREIGN KEY ("unitid") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "itemunit" ADD CONSTRAINT "itemunit_unititemid_fkey" FOREIGN KEY ("unititemid") REFERENCES "unititems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "traits" ADD CONSTRAINT "traits_compid_fkey" FOREIGN KEY ("compid") REFERENCES "composition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "traits" ADD CONSTRAINT "traits_variationid_fkey" FOREIGN KEY ("variationid") REFERENCES "variation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit" ADD CONSTRAINT "unit_compid_fkey" FOREIGN KEY ("compid") REFERENCES "composition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit" ADD CONSTRAINT "unit_variationid_fkey" FOREIGN KEY ("variationid") REFERENCES "variation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unithex" ADD CONSTRAINT "unithex_compid_fkey" FOREIGN KEY ("compid") REFERENCES "composition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unititems" ADD CONSTRAINT "unititems_compid_fkey" FOREIGN KEY ("compid") REFERENCES "composition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "variation" ADD CONSTRAINT "variation_compid_fkey" FOREIGN KEY ("compid") REFERENCES "composition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
