import { sum, map, groupBy } from 'lodash'

/**
 *
 * @param {number} x основание логарифма
 * @param {number} y число, из которого берется логарифм
 * @return {number} логарифм из y по основанию x (то есть, logxy)
 */
export function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x)
}

/**
 *
 * @param {number} N - count of participants
 * @return {number[]} tourDuelCount - array of each tour duel count
 */
export function gridTourDuelCount(N) {
  const tours = getBaseLog(2, N) //5.00008
  const tourDuelCount = []
  const tourCount = Math.floor(tours)
  const mainGridParticipantsCount = Math.pow(2, tourCount)
  const zeroTourDuelCount = N - mainGridParticipantsCount // 0 or > 0
  tourDuelCount.push(zeroTourDuelCount)
  for (let i = 1; i <= tourCount; i++) {
    tourDuelCount.push(Math.pow(2, tourCount - i))
  }
  //console.log("totalDuelCount", totalDuelCount)
  tourDuelCount[tourDuelCount.length - 1]++ //one additional duel for 3rd place, after the Final
  return tourDuelCount
}

/**
 * @param {number[]} inputArray - array of duel count in each tour
 * @return {number[]} correctionArray - shows how many duels were before current(array-index) tour
 */
export function totalCountDuelsBeforeTour(inputArray) {
  const correctionArray = inputArray.map((elem, index, array) => {
    const countBefore = array.slice(0, index)
    return sum(countBefore)
  })
  return correctionArray
}

/**
 * @param {number} N - number of participants
 * @return {object} grid - Duel objects with relations (witch is next)
 */
export function generateGrid(N) {
  const duelCountByTour = gridTourDuelCount(N)
  const correctionForTour = totalCountDuelsBeforeTour(duelCountByTour)
  const duelCountTotal = sum(duelCountByTour)
  let grid = {}

  duelCountByTour.forEach((tourDuelCont, tourIndex) => {
    const correction = correctionForTour[tourIndex]
    const tourBeginDuelIndex = correction + 1
    const tourEndDuelIndex = correction + tourDuelCont

    for (let i = tourBeginDuelIndex; i <= tourEndDuelIndex; i++) {
      const next = +((i - correction) / 2).toFixed(0) + correction + tourDuelCont
      const level = tourIndex
      Object.assign(grid, { [i]: { next, level } })
    }
  })

  //final
  grid[duelCountTotal - 1]['next'] = 0
  grid[duelCountTotal - 1]['label'] = 'Финал'
  //duel for 3rd place
  grid[duelCountTotal]['next'] = 0
  grid[duelCountTotal]['label'] = 'за 3-е место'

  return grid
}

/**
 *
 * @param {Object} grid
 * @return {Object} gridByLevels - object with array of duel-objects
 */
export function gridByLevels(grid) {
  const gridArray = map(grid, (elem, key) => {
    return { id: key, ...elem }
  })

  return groupBy(gridArray, 'level')
}

/**
 * returns table trainerId-color
 * @param {object[]} participants
 * @example
 * returns {trainerId1: "aqua", trainerId2: "teal" }
 */
export function trainerColors(participants) {
  const trainerColorsMap = {}
  const participantsGroupedByTrainer = groupBy(participants, 'trainerId')
  const trainerIds = Object.keys(participantsGroupedByTrainer)
  const commonHtmlColors = [
    'teal',
    'aqua',
    'green',
    'lime',
    'olive',
    'yellow',
    'maroon',
    'black',
    'gray',
    'silver',
    'purple',
    'fuchsia',
    'navy'
    /* 'white', 'red', 'blue'*/
  ]
  trainerIds.forEach((trainerId, index) => {
    trainerColorsMap[trainerId] = commonHtmlColors[index]
  })
  return trainerColorsMap
}

export function participantsInGrid(grid) {
  const alradyInGridSet = new Set()
  Object.keys(grid).forEach(duelId => {
    if (grid[duelId].fighterRed) alradyInGridSet.add(grid[duelId].fighterRed)
    if (grid[duelId].fighterBlue) alradyInGridSet.add(grid[duelId].fighterBlue)
  })
  return alradyInGridSet
}

//  ALL PLAY ALL TOURNAMENT (round-robin tournament)
/*
Rotate clockwise all except 1
1	8				1	2				1	3				1	4				1	5				1	6				1	7
2	7		=>	3	8		=>	4	2		=>	5	3		=>	6	4		=>	7	5		=>	8	6
3	6				4	7				5	8				6	2				7	3				8	4				2	5
4	5				5	6				6	7				7	8				8	2				2	3				3	4

duelCount = n*(n-1)/2
tourCount = n%2 ? n : n-1
*/

export function rotateClockwiseAllExcept1(array1, array2) {
  const n = array1.length
  array2.unshift(array1[1])
  const newArray2 = array2
  const newArray1 = array1.map((elem, index, array) => array[index + 1])
  newArray1[0] = array1[0]
  newArray1[n - 1] = array2[n]
  newArray2.pop()
  return [newArray1, newArray2]
}
