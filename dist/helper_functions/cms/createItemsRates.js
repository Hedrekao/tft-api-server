import { ItemUnit } from '../../types/classes.js';
import { createRequire } from 'module'; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const itemsJson = require('../../static/Items.json');
const createItemsRates = (compositionInput, numberOfComps, itemsData) => {
    for (const unitItems of compositionInput.items) {
        let array = [];
        for (const item in itemsData[unitItems.unitName]['items']) {
            const rate = ((itemsData[unitItems.unitName][item]['numberOfComps'] / numberOfComps) *
                100).toFixed(1);
            const src = itemsJson.items.find((val) => val.id == parseInt(item))?.icon;
            const name = itemsJson.items.find((val) => val.id == parseInt(item))?.name;
            const itemUnit = new ItemUnit(src, name, parseFloat(rate));
            array.push(itemUnit);
        }
        array.sort((a, b) => {
            if (a.rate > b.rate) {
                return -1;
            }
            if (a.rate < b.rate) {
                return 1;
            }
            return 0;
        });
        itemsJson;
        array = array.slice(0, 6);
        unitItems.itemsRate = array;
    }
};
export default createItemsRates;
