import json5 from 'json5';

class Item {
  id: number;
  name: string;
  url: string;

  constructor(id: number, name: string, url: string) {
    this.id = id;
    this.name = name;
    this.url = url;
  }

  changeToJSON() {
    return JSON.stringify(this);
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
  id: string;
  name: string;
  cost: number;
  url: string;
  level: 0 | 1 | 2 | 3;
  items: Item[] | null;

  constructor(
    id: string,
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

  changeToJSON() {
    return JSON.stringify(this);
  }
}

class UnitHex {
  id: string | null;
  name: string | null;
  cost: number | null;
  url: string | null;
  level: 0 | 1 | 2 | 3;
  items: Item[] | null;

  constructor(
    id: string | null,
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
  rank: string;
  lp: number;
  top: number;
  ranking: number;
  rankIcon: string;

  constructor(
    name: string,
    region: string,
    icon: string,
    rank: string,
    lp: number,
    top: number,
    ranking: number,
    rankIcon: string
  ) {
    this.name = name;
    this.icon = icon;
    this.rank = rank;
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

class Last20 {
  placements: number[];
  avgPlacement: number;
  top4Placements: number;
  top4Procentage: number;
  wins: number;
  winsProcentage: number;

  constructor(
    placements: number[],
    avgPlacement: number,
    top4Placements: number,
    top4Procentage: number,
    wins: number,
    winsProcentage: number
  ) {
    this.placements = placements;
    this.avgPlacement = avgPlacement;
    this.top4Placements = top4Placements;
    this.top4Procentage = top4Procentage;
    this.wins = wins;
    this.winsProcentage = winsProcentage;
  }
}

class BuilderTrait {
  name: string;
  active: number;
  breakpoints: number[];
  style: number;
  constructor(
    name: string,
    active: number,
    breakpoints: number[],
    style: number
  ) {
    this.name = name;
    this.active = active;
    this.breakpoints = breakpoints;
    this.style = style;
  }
}

class AnalysisItem {
  name: string;
  id: number;
  avgPlacement: string;
  playRatio: string;

  constructor(
    name: string,
    id: number,
    avgPlacement: string,
    playRatio: string
  ) {
    this.name = name;
    this.id = id;
    this.avgPlacement = avgPlacement;
    this.playRatio = playRatio;
  }
}

class AnalysisUnit {
  name: string;
  id: string;
  items: AnalysisItem[];
  constructor(name: string, id: string, items: AnalysisItem[]) {
    this.name = name;
    this.id = id;
    this.items = items;
  }
}

class Analysis {
  top4Ratio: number;
  winRate: number;
  avgPlace: number;
  playRate: number;
  units: AnalysisUnit[];
  augments: Augment[];
  constructor(
    top4Ratio: number,
    winRate: number,
    avgPlace: number,
    playRate: number,
    units: AnalysisUnit[],
    augments: Augment[]
  ) {
    this.augments = augments;
    this.avgPlace = avgPlace;
    this.winRate = winRate;
    this.top4Ratio = top4Ratio;
    this.playRate = playRate;
    this.units = units;
  }
}

class AnalysisAugment {
  src: string;
  name: string;
  avgPlacement: string;
  winrate: string;
  frequency: string;

  constructor(
    src: string,
    name: string,
    avgPlacement: string,
    winrate: string,
    frequency: string
  ) {
    this.src = src;
    this.name = name;
    this.avgPlacement = avgPlacement;
    this.winrate = winrate;
    this.frequency = frequency;
  }
}

class Comp {
  units: Unit[];
  traits: Trait[];
  avgPlacement: number;
  top4Ratio: number;
  winrate: number;
  playrate: number;
  positioning: UnitHex[][];
  items: UnitItems[];
  augments: Augment[];
  variations: Variation[];

  constructor(
    units: Unit[],
    traits: Trait[],
    avgPlacement: number,
    top4Ratio: number,
    winrate: number,
    playrate: number,
    positioning: UnitHex[][],
    items: UnitItems[],
    augments: Augment[],
    variations: Variation[]
  ) {
    this.units = units;
    this.traits = traits;
    this.avgPlacement = avgPlacement;
    this.top4Ratio = top4Ratio;
    this.winrate = winrate;
    this.playrate = playrate;
    this.positioning = positioning;
    this.items = items;
    this.augments = augments;
    this.variations = variations;
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
  Stats,
  Last20,
  BuilderTrait,
  AnalysisUnit,
  AnalysisItem,
  Analysis,
  AnalysisAugment,
  Comp
};
