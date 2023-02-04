interface RegisterDto {
  email: string;
  password: string;
  userName: string?;
  summonerName: string?;
  region: string?;
}

interface LoginDto {
  email: string;
  password: string;
}

// DATA DRAGON TYPES DONT COVER ALL ATTRIBUTES OF JSON FILE , ALL THE ONES THAT WILL BE USED RN, REMEMBER TO FIX LATER
// icons -> remove 3 last chars with png
// icons -> base url -> https://raw.communitydragon.org/latest/game/

type RawDataDragon = {
  items: Array<DataDragonItems>;
  setData: Array<DataDragonSetData>;
  sets: { [key: number]: RawDataDragonSet };
};

type DataDragon = {
  items: { [key: string]: DataDragonItems };
  augments: { [key: string]: DataDragonItems };
  setData: Array<DataDragonSetData>;
  sets: { [key: number]: DataDragonSet };
};

type DataDragonItems = {
  apiName: string;
  desc: string;
  effects: Object;
  from: Array;
  icon: string;
  id: number;
  name: string;
  unique: boolean;
};

type DataDragonSetData = {
  number: number;
  name: string;
  mutator: string;
  champions: Array<DataDragonChampion>;
  traits: Array<DataDragonTrait>;
};

type DataDragonTrait = {
  apiName: string;
  icon: string;
  name: string;
};

type DataDragonChampion = {
  apiName: string;
  cost: number;
  // can add sqaure to champion icon
  icon: string;
  name: string;
  traits: Array<string>;
};

type RawDataDragonSet = {
  name: string;
  champions: Array<DataDragonChampion>;
  traits: Array<DataDragonTrait>;
};

type DataDragonSet = {
  name: string;
  champions: {
    [key: string]: {
      cost: number;
      icon: string;
      name: string;
      traits: Array<string>;
    };
  };
  traits: DataDragonTrait[];
};

// Analysis route types

type AnalysisInputData = [
  {
    name: string;
    icon: string?;
    level: number;
    items: { id: number }[] | [] | Array<AnalyzedItem>;
  }
];

type AnalyzedItem = {
  id: number;
  apiName: string;
  name: string;
  icon: string;
  playRate: string;
  avgPlace: string;
};

type TransformedUnits = {
  [key: string]: { level: number; items: number[]; itemsNames: string[] };
};

type AugmentsData = {
  [key: string]: {
    sumOfPlacements: number;
    numberOfComps: number;
    numberOfWins: number;
  };
};

type ItemsData = {
  [key: string]: {
    [key: number]: {
      name: string;
      sumOfPlacements: number;
      numberOfComps: number;
    };
  };
};

//CMS types

type ItemsDataCMS = {
  [key: string]: {
    numberOfAppearances: number;
    [key]: {
      numberOfComps: number;
    };
  };
};

//JSON static files types

type AugmentsJSONFile = {
  items: {
    apiName: string;
    desc: string;
    icon: string;
    id: number;
    name: string;
    unique: boolean;
    tier: number;
    effects: Object;
    from: Array<any>;
  }[];
};

type ItemsJSONFile = {
  items: {
    desc: string;
    icon: string;
    id: number;
    name: string;
    unique: boolean;
    type: string;
    effects: Object;
    from: Array<any>;
  }[];
};

//Summoner route types

type SummonerSearchResult = {
  last20: SummonerLast20MatchesStats;
  stats: SummonerStats;
  profile: SummonerProfile;
  matches: SummonerMatch[];
};

type SummonerStats = {
  top4: number;
  top4Percent: string;
  wins: number;
  winsPercent: string;
  avgPlacement: string;
  gamesPlayed: number;
  sumOfPlacements: number;
};

type SummonerProfile = {
  name: string;
  region: string | undefined;
  icon: number;
  rank: string;
  lp: number;
  ranking: number;
  top: string;
};

type SummonerLast20MatchesStats = {
  winsProcentage: string;
  top4Procentage: string;
  avgPlacement: string;
  placements: number[];
  wins: number;
  top4Placements: number;
  sumOfPlacements: number;
};

type SummonerMatch = {
  players: SummonerComposition[];
  matchTime: number;
  timeAgo: string;
  queueType: string;
  placement: number;
  trait: SummonerTrait[];
  units: SummonerUnit[];
  augments: SummonerAugment[];
};

type SummonerComposition = {
  augments: SummonerAugment[];
  goldLeft: number;
  placement: number;
  eliminated: string;
  summonerName: string;
  summonerIcon: number;
  traits: SummonerTrait[];
  units: SummonerUnit[];
};

type SummonerUnit = {
  id: string;
  name: string;
  icon: string;
  level: number;
  cost: number;
  items: {
    id: number;
    apiName: string;
    name: string;
    icon: string;
  }[];
};

type SummonerTrait = {
  apiName: string;
  name: string;
  icon: string;
  currentTrait: number;
  style: number;
};

type SummonerAugment = {
  apiName: string;
  icon: string;
  name: string;
};

//RIOT API types

type RiotAPIChallengerData = {
  tier: string;
  leagueId: string;
  queue: string;
  name: string;
  entries: RiotAPIChallengerDataEntry[];
};

type RiotAPIChallengerDataEntry = {
  summonerId: string;
  summonerName: string;
  leaguePoints: number;
  rank: string;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
};

type RiotAPISummonerLeague = RiotAPIChallengerDataEntry & {
  tier: string;
};

type RiotAPISummonerDto = {
  accountId: string;
  profileIconId: number;
  revisionData: number;
  name: string;
  id: string;
  puuid: string;
  summonerLevel: number;
};

type RiotAPIMatchDto = { metadata: RiotAPIMetadataDto; info: RiotAPIInfoDto };

type RiotAPIMetadataDto = {
  data_version: string;
  match_id: string;
  participants: string[];
};

type RiotAPIInfoDto = {
  game_datetime: number;
  game_length: number;
  game_variation: string;
  game_version: string;
  queue_id: number;
  tft_set_number: number;
  tft_set_core_name: string;
  tft_game_type: string;
  participants: RiotAPIParticipantDto[];
};

type RiotAPIParticipantDto = {
  companion: Object;
  augments: string[];
  gold_left: number;
  last_round: number;
  level: number;
  placement: number;
  players_eliminated: number;
  puuid: string;
  time_eliminated: number;
  total_damage_to_players: number;
  traits: RiotAPITraitDto[];
  units: RiotAPIUnitDto[];
};

type RiotAPITraitDto = {
  name: string;
  num_units: number;
  style: number;
  tier_current: number;
  tier_total: number;
};

type RiotAPIUnitDto = {
  items: number[];
  itemNames: string[];
  character_id: string;
  chosen: string;
  name: string;
  rarity: number;
  tier: number;
};

// Cron task types

type CronTaskData = AugmentsData;
