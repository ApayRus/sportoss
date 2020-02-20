import { generateGrid } from '../components/grid/playOff/functionsPlayOff'
import { generateGridAllPlayAll } from '../components/grid/playAlltoAll/functionsAllPlayAll'
import { divide2 } from '../components/grid/playOff/functionsPlayOff'

const initState = {
  tournament: '',
  category: '',
  tossType: '',
  participants: [],
  grid: {},
  groupParticipants: [[], []],
  group1grid: {},
  group2grid: {}
}

const gridReducer = (state = initState, action) => {
  switch (action.type) {
    // gridType: playOff
    case 'CREATE_GRID': {
      let grid, group1grid, group2grid
      const { gridType, participantCount, participantIds } = action.payload
      if (gridType === 'playOff') grid = generateGrid(participantCount)
      if (gridType === 'allPlayAll') grid = generateGridAllPlayAll(participantIds)
      if (gridType === 'group') {
        const { groupParticipants } = state
        const [group1ParticipantIds, group2ParticipantIds] = groupParticipants
        group1grid = generateGridAllPlayAll([...group1ParticipantIds])
        group2grid = generateGridAllPlayAll([...group2ParticipantIds])
      }
      return { ...state, grid, group1grid, group2grid }
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

    case 'CREATE_GROUPS': {
      const { participantCount } = action.payload
      const groupParticipantCount = divide2(participantCount)
      const emptyArray1 = new Array(groupParticipantCount[0]).fill('')
      const emptyArray2 = new Array(groupParticipantCount[1]).fill('')
      const groupParticipants = [emptyArray1, [...emptyArray2]]
      return { ...state, groupParticipants }
    }

    case 'SET_GROUP_PARTICIPANT': {
      const { groupIndex, participantIndex, participantId } = action.payload
      let { groupParticipants } = state
      groupParticipants = [...groupParticipants]
      groupParticipants[groupIndex][participantIndex] = participantId
      return { ...state, groupParticipants }
    }

    case 'CLEAR_GRID': {
      return { ...initState }
    }

    default:
      return state
  }
}

export default gridReducer
