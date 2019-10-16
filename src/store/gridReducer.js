import { generateGrid } from '../components/grid/functionsPlayOff'
import { generateGridAllPlayAll } from '../components/grid/functionsAllPlayAll'

const initState = {
  tournament: '',
  category: '',
  tossType: '',
  participants: [],
  grid: {}
}

const gridReducer = (state = initState, action) => {
  switch (action.type) {
    // gridType: playOff
    case 'CREATE_GRID': {
      let grid = {}
      const { gridType, participantCount, participantIds } = action.payload
      if (gridType === 'playOff') grid = generateGrid(participantCount)
      if (gridType === 'allPlayAll') grid = generateGridAllPlayAll(participantIds)
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

    //gridType: group

    default:
      return state
  }
}

export default gridReducer
