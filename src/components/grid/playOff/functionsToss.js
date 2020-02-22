/**
 * The Issue is to programmatically place Participants into Grid.
 * we should
 * 1) split Participants into 1 trainer sections and
 * 2) split Grid into N equal disjoint maximally distant parts
 * 3) place Participants into Grid in random way
 */

import { map, groupBy, sortBy } from 'lodash'
import { getBaseLog, spreadEvenly } from './functionsPlayOff'
import store from '../../../store/rootReducer'
import { updateFighter } from '../../../store/gridActions'
/**
 *
 * @param {string[]} array
 * @param {number} n
 * @example
 * splitArrayIntoNBlocks([1, 2, 3, 4, 5, 6, 7, 8], 4) // [ [1, 2], [3, 4], [5, 6], [7, 8] ]
 * splitArrayIntoNBlocks([1, 2, 3, 4, 5, 6, 7, 8], 2) // [ [1, 2, 3, 4], [5, 6, 7, 8] ]
 */
function splitArrayIntoNBlocks(array, n) {
  const blocks = []
  const blockSize = array.length / n
  while (array.length > 0) {
    const block = array.splice(0, blockSize)
    blocks.push(block)
  }
  return blocks
}

/**
 * gets array of objects [{athlet:{id:"id1"}, trainer}, ...]
 * and returns array of arrays with ids [['id1', 'id2',...], [...]]
 *
 */
function participantIdsGroupedByTrainer(participants) {
  const groupedByTrainer = groupBy(participants, 'trainer.id')
  const resultArray = map(groupedByTrainer, elem => {
    return map(elem, 'athlet.id')
  })
  return resultArray
}
// participantIdsGroupedByTrainer(participants)

/**
 * splits grid into N pieces . N = 2, 4, 8, 16,...
 * each duel is also array [fighterRedId, fighterBlueId]
 */
function gridIntoArrayWithNBlocks(grid, n) {
  let gridArray = map(grid, (elem, key) => ({ ...elem, id: key }))
  gridArray = sortBy(gridArray, 'positionInTour')
  let firstTour = gridArray.filter(elem => elem.level === 1)
  firstTour = map(firstTour, 'id')
  const splittedArray = splitArrayIntoNBlocks(firstTour, n)
  return splittedArray
}

// auto-placing participants into grid

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //Максимум не включается, минимум включается
}

export function getRandomElementFromArray(array) {
  const index = getRandomInt(0, array.length)
  return array[index]
}

function emptyPlacesInDuel(grid, duelId) {
  const { fighterRed, fighterBlue } = grid[duelId]
  const emptyPlaces = []
  if (!fighterRed) emptyPlaces.push('Red')
  if (!fighterBlue) emptyPlaces.push('Blue')
  return emptyPlaces
}

export function toss() {
  const { grid, participants } = store.getState().grid
  // const gridBeginning = gridLevelDuelIds(grid, 1)
  const participantsByTrainer = participantIdsGroupedByTrainer(participants)
  console.log('participantsByTrainer', participantsByTrainer)
  //ONE TRAINER
  participantsByTrainer.forEach(participantsGroup => {
    const participantsCountByOneTrainer = participantsGroup.length
    //if there is 5, 6, 7 participants from one trainer and 8 duels in 1st tour,
    //we should place them into 8 places, we split 1-st tour (8 places) into 8 equal parts
    //in general we split grid beginning (1st tour) into nearest 2^N number
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
  })
}
