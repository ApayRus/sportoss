/**
 * The Issue is to programmatically place Participants into Grid.
 * we should
 * 1) split Participants into 1 trainer sections and
 * 2) split Grid into N equal disjoint maximally distant parts
 * 3) place Participants into Grid in random way
 */

import { map, sortBy } from 'lodash'
import { getBaseLog, spreadEvenly } from './functionsPlayOff'
import store from '../../../store/rootReducer'
import { updateFighter } from '../../../store/gridActions'
import {
  participantIdsGroupedByTrainer,
  getRandomInt,
  getRandomElementFromArray
} from '../functions'

/**
 *
 * @param {string[]} array
 * @param {number} n
 * @example
 * splitArrayIntoNBlocks([1, 2, 3, 4, 5, 6, 7, 8], 4) // [ [1, 2], [3, 4], [5, 6], [7, 8] ]
 * splitArrayIntoNBlocks([1, 2, 3, 4, 5, 6, 7, 8], 2) // [ [1, 2, 3, 4], [5, 6, 7, 8] ]
 */
function splitArrayIntoNBlocks(array, n) {
  if (n >= array.length) {
    n = array.length
  }
  const blocks = []
  const blockSize = array.length / n
  while (array.length > 0) {
    const block = array.splice(0, blockSize)
    blocks.push(block)
  }
  return blocks
}

/**
 * splits grid into N pieces . N = 2, 4, 8, 16,...
 * each duel is also array [fighterRedId, fighterBlueId]
 */
function gridIntoArrayWithNBlocks(grid, n) {
  let gridArray = map(grid, (elem, key) => ({ ...elem, id: key }))
  gridArray = sortBy(gridArray, 'positionInTour')
  let firstTour = gridArray.filter(elem => elem.level === 1)
  firstTour = map(firstTour, 'id')
  //if count of fighters larger than duels, we dive into single duels and
  // and use their Red and Blue positions like free places for fighters
  if (firstTour.length < n) {
    const oldFirstTour = [...firstTour]
    firstTour = []
    oldFirstTour.forEach(elem => firstTour.push(elem, elem))
    // [7, 8, 9, 10] => [7, 7, 8, 8, 9, 9, 10, 10]
  }
  const splittedArray = splitArrayIntoNBlocks(firstTour, n)
  return splittedArray
}

// auto-placing participants into grid

function emptyPlacesInDuel(grid, duelId) {
  const { fighterRed, fighterBlue } = grid[duelId]
  const emptyPlaces = []
  if (!fighterRed) emptyPlaces.push('Red')
  if (!fighterBlue) emptyPlaces.push('Blue')
  return emptyPlaces
}

export function tossPlayOff() {
  const { grid, participants } = store.getState().grid
  // const gridBeginning = gridLevelDuelIds(grid, 1)
  const participantsByTrainer = participantIdsGroupedByTrainer(participants)

  //ONE TRAINER
  participantsByTrainer.forEach(participantsGroup => {
    const participantsCountByOneTrainer = participantsGroup.length
    /*  if there is 5, 6, 7 participants from one trainer and 8 duels in 1st tour,
    we should place them into 8 places, we split 1-st tour (8 places) into 8 equal parts
    in general we split grid beginning (1st tour) into nearest 2^N number */
    const nearest2toPowN = num => {
      const log = getBaseLog(2, participantsCountByOneTrainer)
      const pow = Math.ceil(log)
      const result = Math.pow(2, pow)
      return result
    }
    const gridBlockCount = nearest2toPowN(participantsCountByOneTrainer)
    let gridBlocks = gridIntoArrayWithNBlocks(grid, gridBlockCount)
    const distributeMask = spreadEvenly(participantsCountByOneTrainer, gridBlockCount, [], 'random')

    gridBlocks = gridBlocks.filter((elem, index) => distributeMask[index])
    /* we did gridBlocks from 1st level duels (1st level means 2^n), 
    that means there are ideally dividable into 2 on any step 
    after that whe should include into this ideal blocks duels from 0tour, their count is any int number
    after we add duel from 0 tour, we should take place in it's next duel (in 1st tour)
    because this place will be taken by winner in 0 tour duel.*/
    const zeroTourDuels = map(grid, (elem, key) => ({
      duelId: key,
      next: elem.next,
      level: elem.level
    })).filter(elem => elem.level === 0)

    const addZeroTourDuelsAndFakeAthletsTo1stTour = () => {
      zeroTourDuels.forEach(zeroDuel => {
        const { grid } = store.getState().grid
        const nextDuelId = zeroDuel.next
        const fighterColor = grid[nextDuelId]['fighterRed'] ? 'Blue' : 'Red'
        const athletId = 'fakeAthletId' //fake placeholder

        gridBlocks.forEach((gridBlock, index) => {
          if (gridBlock.includes(String(nextDuelId))) {
            gridBlocks[index].push(zeroDuel.duelId)
            store.dispatch(updateFighter({ duelId: nextDuelId, fighterColor, athletId }))
            return
          }
        })
      })
    }
    addZeroTourDuelsAndFakeAthletsTo1stTour()

    //we'll clean all fake athlets after we finished with trainer block

    const clearFakeAthlets = () => {
      const { grid } = store.getState().grid
      const gridDuelIds = Object.keys(grid)
      gridDuelIds.forEach(duelId => {
        const duel = grid[duelId]
        if (duel.fighterRed === 'fakeAthletId') {
          store.dispatch(updateFighter({ duelId, fighterColor: 'Red', athletId: '' }))
        }
        if (duel.fighterBlue === 'fakeAthletId') {
          store.dispatch(updateFighter({ duelId, fighterColor: 'Blue', athletId: '' }))
        }
      })
    }

    //ONE ATHLETE
    participantsGroup.forEach(athletId => {
      //1) get random block and delete it from list
      const randomBlockIndex = getRandomInt(0, gridBlocks.length)
      const randomBlock = gridBlocks.splice(randomBlockIndex, 1)[0]
      //2) get random duel from block and delete it from list
      const randomBlockEmptyPlaces = randomBlock.map(duelId => {
        const { grid } = store.getState().grid
        const emptyPlaces = emptyPlacesInDuel(grid, duelId)
        return { duelId, emptyPlaces }
      })
      const availableDuelsWithEmptyPlaces = randomBlockEmptyPlaces.filter(
        duel => duel.emptyPlaces.length > 0
      )
      const randomDuel = getRandomElementFromArray(availableDuelsWithEmptyPlaces)
      if (randomDuel) {
        const { duelId } = randomDuel
        const fighterColor = getRandomElementFromArray(randomDuel.emptyPlaces)
        store.dispatch(updateFighter({ duelId, fighterColor, athletId }))
      }
    })

    clearFakeAthlets()
  })
}
