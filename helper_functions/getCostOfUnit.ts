const getCostOfUnit = (rarity: number) => {
  switch (rarity) {
    case 0:
      return 1;
    case 1:
      return 2;
    case 2:
      return 3;
    case 3:
      return 6;
    case 4:
      return 4;
    case 5:
      return 7;
    case 6:
      return 5;
    case 7:
      return 8;
  }
};

export default getCostOfUnit;
