import { generateGrid } from '../functions'

const initState = {
  tournament: '',
  category: '',
  tossType: '',
  participants: [],
  grid: {}
}

const gridReducer = (state = initState, action) => {
  switch (action.type) {
    case 'CREATE_GRID': {
      console.log('grid generated', action.payload)
      const grid = generateGrid(action.payload.participantCount)
      return { ...state, grid }
    }

    case 'UPDATE_FIGHTER': {
      console.log('updated fighter', action.payload)
      const { duelId, color, fighterId } = action.payload
      const updatedDuel = { [duelId]: { ...state[duelId], [color]: fighterId } }
      return { ...state, ...updatedDuel }
    }

    case 'SET_WINNER': {
      console.log('winner has set', action.payload)
      const { duelId, fighterId } = action.payload
      const updatedDuel = { [duelId]: { ...state[duelId], winner: fighterId } }
      return { ...state, ...updatedDuel }
    }

    case 'SET_GRID_PARAMETER': {
      const key = Object.keys(action.payload)[0]
      const value = action.payload[key]
      return { ...state, [key]: value }
    }

    default:
      return state
  }
}

export default gridReducer
