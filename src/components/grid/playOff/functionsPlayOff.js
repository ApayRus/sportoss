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

const distributeDuelsInZeroTour = (duelCountIdeal, duelCountReal) => {
  const distributeTo8 = duelCount => {
    switch (duelCount) {
      case 1:
        return [1, 0, 0, 0, 0, 0, 0, 0]
      case 2:
        return [1, 0, 0, 0, 1, 0, 0, 0]
      case 3:
        return [1, 0, 1, 0, 1, 0, 0, 0]
      case 4:
        return [1, 0, 1, 0, 1, 0, 1, 0]
      case 5:
        return [1, 1, 1, 0, 1, 0, 1, 0]
      case 6:
        return [1, 1, 1, 0, 1, 1, 1, 0]
      case 7:
        return [1, 1, 1, 1, 1, 1, 1, 0]
      default:
        return []
    }
  }

  const distributeTo16 = duelCount => {
    switch (duelCount) {
      case 1:
        return [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      case 2:
        return [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
      case 3:
        return [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
      case 4:
        return [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
      case 5:
        return [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
      case 6:
        return [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0]
      case 7:
        return [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0]
      case 8:
        return [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
      case 9:
        return [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
      case 10:
        return [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0]
      case 11:
        return [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0]
      case 12:
        return [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0]
      case 13:
        return [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0]
      case 14:
        return [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0]
      case 15:
        return [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
      default:
        return []
    }
  }
  switch (duelCountIdeal) {
    case 8:
      return distributeTo8(duelCountReal)
    case 16:
      return distributeTo16(duelCountReal)
    default:
      return []
  }
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
        const distributeMask = distributeDuelsInZeroTour(zeroTourIdealCount, zeroTourRealCount)
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
