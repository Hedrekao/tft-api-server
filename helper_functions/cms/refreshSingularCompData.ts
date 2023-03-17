import { Comp } from 'types/classes';
import find4MostFrequentItemsOnCoreUnits from './getItemsAndAugmentsAndVariationsPerformance.js';
import getPerformanceForCoreUnits from '../../routes_functions/cmsRoute.js';

export async function refreshSingularCompData(comp: Comp) {
  const inputForCorePerformanceAnalysis = [];

  for (const unit of comp.units) {
    if (unit.isCore) {
      const tempUnit = {
        name: unit.id,
        level: 0,
        icon: unit.url,
        items: []
      };
      inputForCorePerformanceAnalysis.push(tempUnit);
    }
  }

  const corePerformance = await getPerformanceForCoreUnits(
    inputForCorePerformanceAnalysis as AnalysisInputData,
    1000,
    1000
  );

  if (corePerformance != null) {
    comp.avgPlacement = corePerformance['avgPlace'];
    comp.winrate = corePerformance['winRate'];
    comp.top4Ratio = corePerformance['top4Ratio'];
    comp.playrate = corePerformance['playRate'];
  }

  const result = await find4MostFrequentItemsOnCoreUnits(comp);

  return result;
}
