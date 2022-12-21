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

type DataDragon = {
  items: Array<DataDragonItems>;
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

type DataDragonSet = {
  name: string;
  champions: Array<DataDragonChampion>;
  traits: Arrat<DataDragonTrait>;
};
