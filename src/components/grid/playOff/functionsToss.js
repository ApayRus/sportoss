/**
 * The Issue is to programmatically place Participants into Grid.
 * we should
 * 1) split Participants into 1 trainer sections and
 * 2) split Grid into N equal disjoint maximally distant parts
 * 3) place Participants into Grid in random way
 */

import { map, groupBy, sortBy } from 'lodash'

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
  const firstTour = gridArray.filter(elem => elem.level === 1)
  const splitedArray = splitArrayIntoNBlocks(firstTour, 4)
  return splitedArray
}
// console.log("gridIntoArrayWithNBlocks");
// console.log(gridIntoArrayWithNBlocks(gridRoot, 4));

/**
 *
 * returns array of duel ids , with empty places for fighter
 * @example
 * emptyDuelsInBlock( [
 * {id:'1', fighterRed:'xxx', fighterBlue:'yyy'},
 * {id:'2'},
 * {id:'3', fighterBlue="zzz"},
 * {id:'4'} ] )
 * // [1, 2, 3]
 * returns [1, 2, 3], because there is free space for placing fighter
 * in [0] there is no free space
 */
function emptyDuelsInBlock(block) {
  const emptyDuels = []
  block.forEach((duel, index) => {
    if (!(duel.fighterRed && duel.fighterBlue)) {
      emptyDuels.push(index)
    }
  })
  return emptyDuels
}

// const block = gridIntoArrayWithNBlocks(gridRoot, 4)[2];
// console.log("emptyDuelsInBlock");
// console.log(emptyDuelsInBlock(block));

// auto-placing participants into grid

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //Максимум не включается, минимум включается
}

/**
 *
 * @param {string[]} gridBlock - IDs of duels
 * @example
 * randomDuelFromGridBlock(['a', 'b', 'c', 'd']) // 'c'
 * randomDuelFromGridBlock(['a', 'b', 'c', 'd']) // 'a'
 */
function randomDuelFromGridBlock(gridBlock) {
  const randomIndex = getRandomInt(0, gridBlock.length)
  return gridBlock[randomIndex]
}

/**
 * 
 * @param {Object.<Object>} grid 
 * @example
  const grid = {
      '1': {
        next: 9,
        level: 1
      },
      '2': {
        next: 9,
        level: 1
      }
    }
    gridFirstLevelDuelIds(grid) // ['1', '2']
 */
function gridLevelDuelIds(grid, level) {
  const gridArray = map(grid, (elem, key) => {
    return { id: key, ...elem }
  })
  const gridFirstLevelDuels = gridArray.filter(elem => elem.level === level)
  const gridFirstLevelDuelIds = map(gridFirstLevelDuels, 'id')
  return gridFirstLevelDuelIds
}

function emptyPlacesInDuel(grid, duelId) {
  const { fighterRed, fighterBlue } = grid[duelId]
  const emptyPlaces = []
  if (fighterRed === '') emptyPlaces.push('Red')
  if (fighterBlue === '') emptyPlaces.push('Blue')
  return emptyPlaces
}
