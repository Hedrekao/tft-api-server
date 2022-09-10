const mapItems = (names, ids) => {
    const result = [];
    for (let i = 0; i < names.length; i++) {
        result.push({ id: ids[i], name: names[i] });
    }
    return result;
};
export default mapItems;
