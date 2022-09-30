class Item {
  id;
  name;
  url;

  constructor(id, name, url) {
    this.id = id;
    this.name = name;
    this.url = url;
  }

  changeToJSON() {
    return JSON.stringify(this);
  }
}

class Trait {
  name;
  currentTrait;
  traitStyle;
  url;

  constructor(name, currentTrait, traitStyle, url) {
    this.name = name;
    this.currentTrait = currentTrait;
    this.traitStyle = traitStyle;
    this.url = url;
  }
}

class Unit {
  id;
  name;
  cost;
  url;
  level;
  items;

  constructor(id, name, cost, url, level, items) {
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
  id;
  name;
  cost;
  url;
  level;
  item;

  constructor(id, name, cost, url, level, items) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.url = url;
    this.level = level;
    this.items = items;
  }
}

class Variation {
  avgPlacement;
  top4ratio;
  units;
  traits;

  constructor(avgPlacement, top4ratio, units, traits) {
    this.avgPlacement = avgPlacement;
    this.top4ratio = top4ratio;
    this.units = units;
    this.traits = traits;
  }
}

class UnitItems {
  unitName;
  unitSrc;
  cost;
  itemsBIS;
  itemsRate;

  constructor(unitName, unitSrc, cost, itemsBIS, itemsRate) {
    this.unitName = unitName;
    this.unitSrc = unitSrc;
    this.cost = cost;
    this.itemsBIS = itemsBIS;
    this.itemsRate = itemsRate;
  }
}

class ItemUnit {
  src;
  name;
  rate;

  constructor(src, name, rate) {
    this.name = name;
    this.src = src;
    this.rate = rate;
  }
}

class Augment {
  src;
  name;
  avgPlacement;
  winrate;
  frequency;

  constructor(src, name, avgPlacement, winrate, frequency) {
    this.src = src;
    this.name = name;
    this.avgPlacement = avgPlacement;
    this.winrate = winrate;
    this.frequency = frequency;
  }
}

class Companion {
  placement;
  icon;
  name;
  roundEliminated;
  augments;
  traits;
  units;
  goldLeft;

  constructor(
    placement,
    icon,
    name,
    roundEliminated,
    augments,
    traits,
    units,
    goldLeft
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
  placement;
  queueType;
  timeAgo;
  augments;
  units;
  traits;
  companion;

  constructor(
    placement,
    queueType,
    timeAgo,
    augments,
    units,
    traits,
    companion
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
  name;
  region;
  icon;
  rank;
  lp;
  top;
  ranking;
  rankIcon;

  constructor(name, region, icon, rank, lp, top, ranking, rankIcon) {
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
  played;
  wins;
  percentWins;
  top4;
  percentTop4;
  avgPlacement;

  constructor(played, wins, percentWins, top4, percentTop4, avgPlacement) {
    this.played = played;
    this.wins = wins;
    this.percentTop4 = percentTop4;
    this.percentWins = percentWins;
    this.top4 = top4;
    this.avgPlacement = avgPlacement;
  }
}

class Last20 {
  placements;
  avgPlacement;
  top4Placements;
  top4Procentage;
  wins;
  winsProcentage;

  constructor(
    placements,
    avgPlacement,
    top4Placements,
    top4Procentage,
    wins,
    winsProcentage
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
  name;
  active;
  breakpoints;
  style;
  constructor(name, active, breakpoints, style) {
    this.name = name;
    this.active = active;
    this.breakpoints = breakpoints;
    this.style = style;
  }
}

class AnalysisItem {
  name;
  id;
  avgPlacement;
  playRatio;

  constructor(name, id, avgPlacement, playRatio) {
    this.name = name;
    this.id = id;
    this.avgPlacement = avgPlacement;
    this.playRatio = playRatio;
  }
}

class AnalysisUnit {
  name;
  id;
  items;
  constructor(name, id, items) {
    this.name = name;
    this.id = id;
    this.items = items;
  }
}

class Analysis {
  top4Ratio;
  avgPlace;
  playRate;
  units;
  augments;
  constructor(top4Ratio, winRate, avgPlace, playRate, units, augments) {
    this.augments = augments;
    this.avgPlace = avgPlace;
    this.winRate = winRate;
    this.top4Ratio = top4Ratio;
    this.playRate = playRate;
    this.units = units;
  }
}

class AnalysisAugment {
  src;
  name;
  avgPlacement;
  winrate;
  frequency;

  constructor(src, name, avgPlacement, winrate, frequency) {
    this.src = src;
    this.name = name;
    this.avgPlacement = avgPlacement;
    this.winrate = winrate;
    this.frequency = frequency;
  }
}

class Comp {
  units;
  traits;
  avgPlacement;
  top4Ratio;
  winrate;
  playrate;
  positioning;
  items;
  augments;
  variations;

  constructor(
    units,
    traits,
    avgPlacement,
    top4Ratio,
    winrate,
    playrate,
    positioning,
    items,
    augments,
    variations
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
