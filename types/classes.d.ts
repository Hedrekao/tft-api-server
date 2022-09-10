class Item {
  id: number;
  name: string;
  url: string;

  constructor(id: number, name: string, url: string) {
    this.id = id;
    this.name = name;
    this.url = url;
  }
}

class Trait {
  name: string;
  currentTrait: number;
  traitStyle: number;
  url: string;

  constructor(
    name: string,
    currentTrait: number,
    traitStyle: number,
    url: string
  ) {
    this.name = name;
    this.currentTrait = currentTrait;
    this.traitStyle = traitStyle;
    this.url = url;
  }
}

class Unit {
  id: number;
  name: string;
  cost: number;
  url: string;
  level: 0 | 1 | 2 | 3;
  items: Item[] | null;

  constructor(
    id: number,
    name: string,
    cost: number,
    url: string,
    level: 0 | 1 | 2 | 3,
    items: Item[] | null
  ) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.url = url;
    this.level = level;
    this.items = items;
  }
}

class UnitHex {
  id: number | null;
  name: string | null;
  cost: number | null;
  url: string | null;
  level: 0 | 1 | 2 | 3;
  items: Item[] | null;

  constructor(
    id: number | null,
    name: string | null,
    cost: number | null,
    url: string | null,
    level: 0 | 1 | 2 | 3,
    items: Item[] | null
  ) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.url = url;
    this.level = level;
    this.items = items;
  }
}

class Variation {
  avgPlacement: number;
  top4ratio: number;
  units: Unit[];
  traits: Trait[];

  constructor(
    avgPlacement: number,
    top4ratio: number,
    units: Unit[],
    traits: Trait[]
  ) {
    this.avgPlacement = avgPlacement;
    this.top4ratio = top4ratio;
    this.units = units;
    this.traits = traits;
  }
}

class UnitItems {
  unitName: string;
  unitSrc: string;
  cost: number;
  itemsBIS: ItemUnit[];
  itemsRate: ItemUnit[];

  constructor(
    unitName: string,
    unitSrc: string,
    cost: number,
    itemsBIS: ItemUnit[],
    itemsRate: ItemUnit[]
  ) {
    this.unitName = unitName;
    this.unitSrc = unitSrc;
    this.cost = cost;
    this.itemsBIS = itemsBIS;
    this.itemsRate = itemsRate;
  }
}

class ItemUnit {
  src: string;
  name: string;
  rate: number | null;

  constructor(src: string, name: string, rate: number | null) {
    this.name = name;
    this.src = src;
    this.rate = rate;
  }
}

class Augment {
  src: string;
  name: string;
  avgPlacement: number;
  winrate: number;
  frequency: number;

  constructor(
    src: string,
    name: string,
    avgPlacement: number,
    winrate: number,
    frequency: number
  ) {
    this.src = src;
    this.name = name;
    this.avgPlacement = avgPlacement;
    this.winrate = winrate;
    this.frequency = frequency;
  }
}

class Companion {
  placement: number;
  icon: string;
  name: string;
  roundEliminated: string;
  augments: string[];
  traits: Trait[];
  units: Unit[];
  goldLeft: number;

  constructor(
    placement: number,
    icon: string,
    name: string,
    roundEliminated: string,
    augments: string[],
    traits: Trait[],
    units: Unit[],
    goldLeft: number
  ) {
    this.placement = placement;
    this.icon = icon;
    this.name = name;
    this.roundEliminated = roundEliminated;
    this.augments = augments;
    this.traits = traits;
    this.units = units;
    this.goldLeft = goldLeft;
  }
}

class Match {
  placement: number;
  queueType: 'Ranked' | 'Normal';
  timeAgo: string;
  augments: string[];
  units: Unit[];
  traits: Trait[];
  companion: Companion[];

  constructor(
    placement: number,
    queueType: 'Ranked' | 'Normal',
    timeAgo: string,
    augments: string[],
    units: Unit[],
    traits: Trait[],
    companion: Companion[]
  ) {
    this.placement = placement;
    this.queueType = queueType;
    this.timeAgo = timeAgo;
    this.augments = augments;
    this.units = units;
    this.traits = traits;
    this.companion = companion;
  }
}

class Profile {
  name: string;
  region: string;
  icon: string;
  rank: number;
  tier: string;
  lp: number;
  top: number;
  ranking: number;
  rankIcon: string;

  constructor(
    name: string,
    region: string,
    icon: string,
    rank: number,
    tier: string,
    lp: number,
    top: number,
    ranking: number,
    rankIcon: string
  ) {
    this.name = name;
    this.icon = icon;
    this.rank = rank;
    this.tier = tier;
    this.lp = lp;
    this.top = top;
    this.ranking = ranking;
    this.region = region;
    this.rankIcon = rankIcon;
  }
}

class Stats {
  played: number;
  wins: number;
  percentWins: number;
  top4: number;
  percentTop4: number;
  avgPlacement: number;

  constructor(
    played: number,
    wins: number,
    percentWins: number,
    top4: number,
    percentTop4: number,
    avgPlacement: number
  ) {
    this.played = played;
    this.wins = wins;
    this.percentTop4 = percentTop4;
    this.percentWins = percentWins;
    this.top4 = top4;
    this.avgPlacement = avgPlacement;
  }
}

export {
  Item,
  Trait,
  Unit,
  UnitHex,
  Variation,
  UnitItems,
  ItemUnit,
  Augment,
  Companion,
  Match,
  Profile,
  Stats
};
