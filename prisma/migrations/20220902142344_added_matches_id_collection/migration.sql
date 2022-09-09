-- CreateTable
CREATE TABLE "augments" (
    "id" INTEGER NOT NULL,
    "rarity" INTEGER,
    "name" VARCHAR(50),
    "description" VARCHAR(200),

    CONSTRAINT "augments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "augments_composition" (
    "augment_id" INTEGER NOT NULL,
    "composition_id" INTEGER NOT NULL,
    "avg_place" DECIMAL(3,1),
    "winrate" DECIMAL(4,1),
    "frequency" DECIMAL(4,1),

    CONSTRAINT "augments_composition_pkey" PRIMARY KEY ("augment_id","composition_id")
);

-- CreateTable
CREATE TABLE "champions" (
    "id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(50),
    "cost" INTEGER,

    CONSTRAINT "champions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "champions_composition" (
    "champion_id" VARCHAR(100) NOT NULL,
    "composition_id" INTEGER NOT NULL,
    "isthreestar" BOOLEAN,
    "x_grid_position" INTEGER,
    "y_grid_position" INTEGER,

    CONSTRAINT "champions_composition_pkey" PRIMARY KEY ("champion_id","composition_id")
);

-- CreateTable
CREATE TABLE "champions_items" (
    "champion_id" VARCHAR(100) NOT NULL,
    "item_id" INTEGER NOT NULL,
    "play_ratio" DECIMAL(4,1),
    "isbis" BOOLEAN,

    CONSTRAINT "champions_items_pkey" PRIMARY KEY ("champion_id","item_id")
);

-- CreateTable
CREATE TABLE "champions_traits" (
    "champion_id" VARCHAR(100) NOT NULL,
    "trait_id" VARCHAR(100) NOT NULL,

    CONSTRAINT "champions_traits_pkey" PRIMARY KEY ("champion_id","trait_id")
);

-- CreateTable
CREATE TABLE "compositions" (
    "id" INTEGER NOT NULL,
    "avg_placement" INTEGER,
    "top4_ratio" INTEGER,
    "play_ratio" INTEGER,
    "winrate" INTEGER,

    CONSTRAINT "compositions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "general_data" (
    "match_id" TEXT NOT NULL,

    CONSTRAINT "general_data_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(50),
    "description" VARCHAR(200),

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traits" (
    "name" VARCHAR(100) NOT NULL,
    "isorigin" BOOLEAN,

    CONSTRAINT "traits_pkey" PRIMARY KEY ("name")
);

-- AddForeignKey
ALTER TABLE "augments_composition" ADD CONSTRAINT "augments_composition_augment_id_fkey" FOREIGN KEY ("augment_id") REFERENCES "augments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "augments_composition" ADD CONSTRAINT "augments_composition_composition_id_fkey" FOREIGN KEY ("composition_id") REFERENCES "compositions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "champions_composition" ADD CONSTRAINT "champions_composition_champion_id_fkey" FOREIGN KEY ("champion_id") REFERENCES "champions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "champions_composition" ADD CONSTRAINT "champions_composition_composition_id_fkey" FOREIGN KEY ("composition_id") REFERENCES "compositions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "champions_items" ADD CONSTRAINT "champions_items_champion_id_fkey" FOREIGN KEY ("champion_id") REFERENCES "champions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "champions_items" ADD CONSTRAINT "champions_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "champions_traits" ADD CONSTRAINT "champions_traits_champion_id_fkey" FOREIGN KEY ("champion_id") REFERENCES "champions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "champions_traits" ADD CONSTRAINT "champions_traits_trait_id_fkey" FOREIGN KEY ("trait_id") REFERENCES "traits"("name") ON DELETE NO ACTION ON UPDATE NO ACTION;
