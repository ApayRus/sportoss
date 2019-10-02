/**
 *
 * @param {Object} payload
 * @param {number} payload.participantsCount
 * @returns {Object} action
 */
export function createGrid(payload) {
  return { type: 'CREATE_GRID', payload }
}

const createGridExample = {
  type: 'CREATE_GRID',
  payload: { participantCount: 32 }
}

/**
 *
 * @param {Object} payload
 * @param {number} payload.duelId
 * @param {string} payload.color
 * @param {string} payload.fighterId
 * @returns {Object} action
 */
export function updateFighter(payload) {
  return { type: 'UPDATE_FIGHTER', payload }
}

const updateFighterExample = {
  type: 'UPDATE_FIGHTER',
  payload: { duelId: 8, color: 'red', fighterId: 'djdjdjdjdj' }
}

/**
 *
 * @param {Object} payload
 * @param {number} payload.duelId
 * @param {string} payload.fighterId
 * @returns {Object} action
 */
export function setWinner(payload) {
  return { type: 'SET_WINNER', payload }
}

const setWinnerExample = {
  type: 'SET_WINNER',
  payload: { duelId: 8, fighterId: 'cccdddeee' }
}

/**
 * 
 * @param {*} payload 
 * @example 
    setGridParameter({ participants })
    setGridParameter({ trainerColorMap })
    setGridParameter({ tournament })
    setGridParameter({ category })
 */
export function setGridParameter(payload) {
  return { type: 'SET_GRID_PARAMETER', payload }
}
