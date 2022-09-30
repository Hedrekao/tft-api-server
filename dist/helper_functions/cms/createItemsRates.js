import { ItemUnit, UnitItems } from '../../types/classes.js';
import { createRequire } from 'module'; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const itemsJson = require('../../static/Items.json');
const itemsDataJson = itemsJson['items'];
const createItemsRates = (compositionInput, numberOfComps, itemsData) => {
    const unitItemsArr = [];
    for (const unit of compositionInput.units) {
        let itemRates = [];
        for (const item in itemsData[unit.id]) {
            const rate = ((itemsData[unit.id][item]['numberOfComps'] / numberOfComps) *
                100).toFixed(1);
            const src = `https://ittledul.sirv.com/Images/items/${item}.png`;
            const itemNameObject = itemsDataJson.find((val) => val['id'] == item);
            const name = itemNameObject['name'];
            const itemUnit = new ItemUnit(src, name, parseFloat(rate));
            itemRates.push(itemUnit);
        }
        console.log(itemRates);
        itemRates.sort((a, b) => {
            if (a.rate > b.rate) {
                return -1;
            }
            if (a.rate < b.rate) {
                return 1;
            }
            return 0;
        });
        itemRates = itemRates.slice(0, 6);
        let itemsBIS = [];
        if (unit.items != null && unit.items.length > 0) {
            for (const item of unit.items) {
                const src = `https://ittledul.sirv.com/Images/items/${item.id}.png`;
                const itemNameObject = itemsDataJson.find((val) => val['id'] == item.id);
                const name = itemNameObject['name'];
                const itemUnit = new ItemUnit(src, name, null);
                itemsBIS.push(itemUnit);
            }
        }
        console.log(1);
        const unitItems = new UnitItems(unit.id, unit.url, unit.cost, itemsBIS, itemRates);
        unitItemsArr.push(unitItems);
    }
    compositionInput.items = unitItemsArr;
    console.log(JSON.stringify(unitItemsArr, null, 4));
};
export default createItemsRates;
