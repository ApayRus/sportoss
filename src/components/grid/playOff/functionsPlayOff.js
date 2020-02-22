import { sum, map, groupBy } from 'lodash'
import { getRandomElementFromArray } from './functionsToss'

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

  const generateTourDuels = (tourDuelCont, tourIndex) => {
    const correction = correctionForTour[tourIndex]
    const tourBeginDuelIndex = correction + 1
    const tourEndDuelIndex = correction + tourDuelCont
    const tourDuels = {}
    for (let i = tourBeginDuelIndex; i <= tourEndDuelIndex; i++) {
      const next = +((i - correction) / 2).toFixed(0) + correction + tourDuelCont
      const level = tourIndex
      const positionInTour = i - tourBeginDuelIndex //we need position for Zero tour, to handle empty spaces
      tourDuels[i] = { next, level, positionInTour }
    }
    return tourDuels
  }

  duelCountByTour.forEach((tourDuelCont, tourIndex) => {
    const tourDuels = generateTourDuels(tourDuelCont, tourIndex)
    Object.assign(grid, tourDuels)
  })
  //final
  grid[duelCountTotal]['next'] = 0

  //if there is Zero tour, we should fill it with  fake duels to it's ideal size
  //and we should provide grid with fake duels to fill empty spaces
  //we must evenly distribute real duels among fake ones
  const zeroTourRealCount = duelCountByTour[0]
  if (zeroTourRealCount > 0) {
    const rewriteZeroTourWithFakeDuels = () => {
      const distributedZeroTour = () => {
        const tourCount = duelCountByTour.length
        const zeroTourIdealCount = Math.pow(2, tourCount - 1)
        const zeroTourFakeCount = zeroTourIdealCount - zeroTourRealCount
        const idealZeroTour = generateTourDuels(zeroTourIdealCount, 0)
        const distributeMask = spreadEvenly(zeroTourRealCount, zeroTourIdealCount, [], 'random')
        const realZeroTour = {}
        let duelId = 1
        distributeMask.forEach((elem, index) => {
          if (elem) {
            const idealDuel = idealZeroTour[index + 1]
            const next = idealDuel.next - zeroTourFakeCount
            realZeroTour[duelId] = { ...idealDuel, next }
            duelId++
          }
        })
        return realZeroTour
      }
      Object.assign(grid, distributedZeroTour())
    }
    rewriteZeroTourWithFakeDuels()
  }

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
  const realDuelPositions = map(zeroTour, 'positionInTour')
  if (zeroTour) {
    const levelCount = Object.keys(gridByLevels0).length
    const duelCountAll = Math.pow(2, levelCount - 1) // real + fake
    const fakeDuels = []
    for (let id = 1; id <= duelCountAll; id++) {
      const fakeId = `${id}#`
      fakeDuels.push({ id: fakeId, status: 'fake', level: 0, positionInTour: id - 1 })
    }
    realDuelPositions.forEach(elem => {
      fakeDuels[elem] = zeroTour.shift()
    })
    zeroTour = fakeDuels
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

// spread evenly
/**
 *
 * @param {number} count - any integer number
 * @param {number} positions - 2^N
 * @param {number[]} mask - accumulator array for recursive function
 * @param {string} optionForExtra - "extraTop", "extraBottom", "random" - where will be placed extra values
 * @example
 * spreadEvenly(2, 8) // [1, 0, 0, 0, 1, 0, 0, 0]
 * spreadEvenly(3, 8) // [1, 0, 1, 0, 1, 0, 0, 0]
 * spreadEvenly(4, 8) // [1, 0, 1, 0, 1, 0, 1, 0]
 * spreadEvenly(5, 8) // [1, 1, 1, 0, 1, 0, 1, 0]
 * spreadEvenly(6, 8) // [1, 1, 1, 0, 1, 1, 1, 0]
 */
export function spreadEvenly(count, positions, mask = [], optionForExtra = 'extraTop') {
  if (count === 1 || getBaseLog(2, count) % 1 === 0) {
    const newMask = standartDistributeMask(count, positions)
    mask.push(...newMask)
  } else {
    const newCounts = divide2(count, optionForExtra)
    const newPositions = positions / 2
    spreadEvenly(newCounts[0], newPositions, mask, optionForExtra)
    spreadEvenly(newCounts[1], newPositions, mask, optionForExtra)
  }
  return mask
}

/**
 *
 * @param {number} count
 * @param {string} option - "extraTop" (larger first), "extraBottom" (lower first), "random" - where will be placed extra values
 * @returns {number[]}
 * @example
 * divide2(7, 'extraBottom) // [3, 4]
 * divide2(7, 'extraTop) // [4, 3]
 * divide2(13, 'extraBottom) // [6, 7]
 * divide2(13, 'extraTop) // [7, 6]
 */
export function divide2(count, option = 'extraTop') {
  const result = []
  const operations = {
    extraTop: 'ceil',
    extraBottom: 'floor',
    random: getRandomElementFromArray(['ceil', 'floor'])
  }
  const operation = operations[option]
  result[0] = Math[operation](count / 2)
  result[1] = count - result[0]
  return result
}

/**
 * Spreads evenly 2^N elements in array with 2^M positions
 * @param {number} count - 2^N elements
 * @param {number[]} positions
 * @returns{number[]}
 * @example
 * standartDistributeMask(1, 8) // [1, 0, 0, 0, 0, 0, 0, 0]
 * standartDistributeMask(2, 8) // [1, 0, 0, 0, 1, 0, 0, 0]
 * standartDistributeMask(4, 8) // [1, 0, 1, 0, 1, 0, 1, 0]
 */
function standartDistributeMask(count, positions) {
  const maskArray = new Array(positions).fill(0)
  const step = positions / count
  return maskArray.map((elem, index) => {
    return index % step ? 0 : 1
  })
}
