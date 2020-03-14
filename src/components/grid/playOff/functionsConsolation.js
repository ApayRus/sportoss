import { map } from 'lodash'

/**
 * 
Consolation-grid is a little new type of grid in addition to main PlayOff-grid
Participants are all who were defeated by the 2 finalists (red and blue)
on first level duel is filled with 2 fighters, on next levels with 1. 
Each fighter on next level is those person who lost to the finalist at next level.

 */

export function getFightersLostToFinalist(finalistId, grid) {
  const gridArray = map(grid, (elem, key) => ({ id: key, ...elem }))
  const duels = gridArray.filter(duel => duel.winner === finalistId)
  const losers = duels.map(duel => {
    const { fighterRed, fighterBlue, winner } = duel
    const duelFighters = [fighterRed, fighterBlue]
    return duelFighters.filter(fighter => fighter !== winner)[0]
  })
  return losers
}

/**
 * there are 3 possible variants, related to duelCount. 
 * lets see example with 3 tours.
1) duelCount = 6, 
  fighters1 (red) - 4 
  fighters2 (blue) - 4
    1 -> 3 -> 5
    2 -> 4 -> 6
2) duelCount = 5
  fighters1 (red) - 3 
  fighters2 (blue) - 4
         2 -> 4
    1 -> 3 -> 5
3) duelCount = 5
  fighters1 (red) - 4 
  fighters2 (blue) - 3
    0 -> 2 -> 4
         3 -> 5    
 */

export function generateConsolationDuels(fighters1, fighters2, startingId) {
  const duelsCount = fighters1.length - 1 + fighters2.length - 1
  const duelsArray = []
  const f1 = [...fighters1]
  const f2 = [...fighters2]
  let duelId = duelsCount

  const getFighters = fighters => {
    return fighters.length > 2
      ? { fighterRed: fighters.pop() }
      : { fighterRed: fighters.pop(), fighterBlue: fighters.pop() }
  }

  const condition = duelId => (f1.length === f2.length ? duelId % 2 : !(duelId % 2))

  const generateDuel = () => {
    let duelFighters = {}
    duelFighters = condition(duelId) ? getFighters(fighters1) : getFighters(fighters2)
    const next = duelId + 1 < duelsCount ? duelId + 2 : 0
    const level = 'con' + Math.ceil(duelsCount % 2 ? (duelId + 1) / 2 : duelId / 2)
    const duel = { id: duelId, ...duelFighters, next, level }
    return duel
  }

  while (duelId >= 0) {
    const duel = generateDuel()
    duelsArray.push(duel)
    duelId--
  }

  //cleaning
  if (f1.length <= f2.length) {
    duelsArray.pop()
  } else {
    duelsArray[duelsArray.length - 1]['id'] = 1
    duelsArray.splice(duelsArray.length - 2, 1)
  }

  const duelsObject = duelsArray.reduce((obj, item) => {
    let { id, next } = item
    id = id + startingId
    if (next) {
      next = next + startingId
    }
    delete item.id
    obj[id] = { ...item, next }
    return obj
  }, {})

  return duelsObject
}
