import { sum, map, groupBy, sortBy, countBy } from 'lodash'

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
  grid[duelCountTotal]['next'] = 0

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

export function gridByLevelsWithFakeDuelsInZeroTour(grid) {
  const gridByLevels0 = { ...gridByLevels(grid) }
  let zeroTour = gridByLevels0[0]
  if (zeroTour) {
    const levelCount = Object.keys(gridByLevels0).length
    const duelCountAll = Math.pow(2, levelCount - 1) // real + fake
    const duelCountReal = zeroTour.length
    const fakeDuels = []
    for (let id = duelCountReal + 1; id <= duelCountAll; id++) {
      const fakeId = `${id}#`
      fakeDuels.push({ id: fakeId, status: 'fake', level: 0 })
    }
    zeroTour = [...zeroTour, ...fakeDuels]
    const gridWithFakeDuels = { ...gridByLevels0, 0: [...zeroTour] }
    return gridWithFakeDuels
  } else {
    return gridByLevels0
  }
}

export function gridInfo(grid) {
  const tourCount = Object.keys(gridByLevels(grid)).length
  const mainDuelCount = Object.keys(grid).length
  return { tourCount, mainDuelCount }
}

export function participantsInGrid(grid) {
  const alradyInGridSet = new Set()
  Object.keys(grid).forEach(duelId => {
    const { fighterRed, fighterBlue } = grid[duelId]
    alradyInGridSet.add(fighterRed)
    alradyInGridSet.add(fighterBlue)
  })
  return alradyInGridSet
}

/**
 * trainer with most of participants will be first, then others,
 * it's nesseccery for place participants in the grid far away of each other
 * @param {*} participants
 */
export function sortParticipantsByTrainerFrequency(participants) {
  const trainerIds = map(participants, 'trainerId') // ['t1', 't3', 't1', 't2', 't1', 't2']
  const countsByTrainer = countBy(trainerIds) //{t1: 3, t2: 2, t3: 1}
  const participantsWithTrainerFrequency = participants.map(elem => {
    const trainerFrequency = countsByTrainer[elem.trainerId]
    return { ...elem, trainerFrequency }
  })
  return sortBy(participantsWithTrainerFrequency, 'trainerFrequency').reverse()
}
