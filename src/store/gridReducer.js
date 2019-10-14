import { generateGrid } from '../components/grid/functionsPlayOff'

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
      const grid = generateGrid(action.payload.participantCount)
      return { ...state, grid }
    }

    case 'UPDATE_FIGHTER': {
      const { duelId, fighterColor, athletId } = action.payload
      const updatedDuel = {
        [duelId]: { ...state.grid[duelId], [`fighter${fighterColor}`]: athletId }
      }
      return { ...state, grid: { ...state.grid, ...updatedDuel } }
    }

    case 'SET_WINNER': {
      const { duelId, athletId } = action.payload
      const updatedDuel = { [duelId]: { ...state.grid[duelId], winner: athletId } }
      return { ...state, grid: { ...state.grid, ...updatedDuel } }
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
