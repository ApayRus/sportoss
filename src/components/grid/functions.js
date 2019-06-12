import { sum, map, groupBy } from "lodash";

/**
 *
 * @param {number} x основание логарифма
 * @param {number} y число, из которого берется логарифм
 * @return {number} логарифм из y по основанию x (то есть, logxy)
 */
export function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

/**
 *
 * @param {number} N - count of participants
 * @return {number[]} tourDuelCount - array of each tour duel count
 */
export function gridTourDuelCount(N) {
  const tours = getBaseLog(2, N); //5.00008
  const tourDuelCount = [];
  //const zeroTour = tours%1 > 0 ? 1 : 0
  const tourCount = Math.floor(tours);
  const mainGridParticipantsCount = Math.pow(2, tourCount);
  const zeroTourDuelCount = N - mainGridParticipantsCount;
  const totalDuelCount = mainGridParticipantsCount + zeroTourDuelCount - 1;
  if (zeroTourDuelCount > 0) tourDuelCount.push(zeroTourDuelCount);
  for (let i = 1; i <= tourCount; i++) {
    tourDuelCount.push(Math.pow(2, tourCount - i));
  }
  //console.log("totalDuelCount", totalDuelCount)
  return tourDuelCount;
}

/**
 * @param {number[]} inputArray - array of duel count in each tour
 * @return {number[]} correctionArray - shows how many duels was before current tour
 */
export function totalCountDuelsBeforeTour(inputArray) {
  const correctionArray = inputArray.map((elem, index, array) => {
    const countBefore = array.slice(0, index);
    return sum(countBefore);
  });
  return correctionArray;
}

/**
 * @param {number} N - number of participants
 * @return {object} grid - Duel objects with relations (witch is next)
 */
export function generateGrid(N) {
  const duelCountByTour = gridTourDuelCount(N);
  const correctionForTour = totalCountDuelsBeforeTour(duelCountByTour);
  const duelCountTotal = sum(duelCountByTour);
  let grid = {};

  duelCountByTour.forEach((tourDuelCont, tourIndex) => {
    const correction = correctionForTour[tourIndex];
    const tourBeginIndex = correction + 1;
    const tourEndIndex = correction + tourDuelCont;

    for (let i = tourBeginIndex; i <= tourEndIndex; i++) {
      const next = +((i - correction) / 2).toFixed(0) + correction + tourDuelCont;
      const level = tourIndex + 1;
      Object.assign(grid, { [i]: { next, level } });
    }
  });

  grid[duelCountTotal]["next"] = 0;

  return grid;
}

/**
 *
 * @param {Object} grid
 * @return {Object} gridByLevels - object with array of duel-objects
 */
export function gridByLevels(grid) {
  const gridArray = map(grid, (elem, key) => {
    return { id: key, ...elem };
  });

  return groupBy(gridArray, "level");
}
