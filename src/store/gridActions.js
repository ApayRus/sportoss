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
 * @param {string} payload.athletId
 * @param {string} payload.operation - set or reset (checked or unchecked)
 * @returns {Object} action
 * @example
  const setWinnerExample = {
    type: 'SET_WINNER',
    payload: { duelId: 8, athletId: 'cccdddeee', operation: 'set' }
  }
 */
export function setWinner(payload) {
    return { type: 'SET_WINNER', payload }
}

/**
 * 
 * @param {*} payload 
 * @example 
    setGridParams({ participants })
    setGridParams({ tournament })
    setGridParams({ category })
 */
export function setGridParams(payload) {
    return { type: 'SET_GRID_PARAMS', payload }
}

/**
 * 
 * @param {Object} payload
 * @param {Number} payload.groupIndex
 * @param {Number} payload.participantIndex
 * @param {String} payload.participantId
 * @example
 const setGroupParticipantExample = {
  type: 'SET_GROUP_PARTICIPANT', 
  payload:{ groupIndex:0, participantIndex:1, participantId:"abcdefg" }
}
 */
export function setGroupParticipant(payload) {
    return { type: 'SET_GROUP_PARTICIPANT', payload }
}

/**
 * 
 * @param {object} payload 
 * @param {number} payload.participantCount
 * @example 
 createGroups({participantCount: 6}) 
 //will made state.groupParticipants:
 [ ['', '', ''], ['', '', ''] ]
 */
export function createGroups(payload) {
    return { type: 'CREATE_GROUPS', payload }
}

/**
 * will set grid to initState
 */
export function clearGrid() {
    return { type: 'CLEAR_GRID' }
}