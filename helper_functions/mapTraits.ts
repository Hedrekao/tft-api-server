const mapTraits = (rawTraits: Array<Object>) => {
  rawTraits = rawTraits.filter((trait) => {
    return trait['style'] != 0;
  }); //maybe unneccesary
  return rawTraits.map((trait) => {
    const result = {
      name: trait['name'],
      currentTrait: trait['num_units'],
      style: trait['style']
    };
    return result;
  });
};

export default mapTraits;
