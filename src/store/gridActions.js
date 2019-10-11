/**
 *
 * @param {Object} payload
 * @param {number} payload.participantsCount
 * @returns {Object} action
 * @example 
  const createGridExample = {
    type: 'CREATE_GRID',
    payload: { participantCount: 8 }
  }
 */
export function createGrid(payload) {
  return { type: 'CREATE_GRID', payload }
}

/**
 *
 * @param {Object} payload
 * @param {string} payload.duelId
 * @param {string} payload.fighterColor
 * @param {string} payload.athletId
 * @returns {Object} action
 * @example
  const updateFighterExample = {
    type: 'UPDATE_FIGHTER',
    payload: { duelId: 1, fighterColor: 'Red', athletId: 'djdjdjdjdj' }
  }
 */
export function updateFighter(payload) {
  return { type: 'UPDATE_FIGHTER', payload }
}

/**
 *
 * @param {Object} payload
 * @param {number} payload.duelId
 * @param {string} payload.fighterId
 * @returns {Object} action
 * @example
  const setWinnerExample = {
    type: 'SET_WINNER',
    payload: { duelId: 8, athletId: 'cccdddeee' }
  }
 */
export function setWinner(payload) {
  return { type: 'SET_WINNER', payload }
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
