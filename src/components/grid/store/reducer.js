import { generateGrid } from "../functions";

const gridReducer = (state = {}, action) => {
  switch (action.type) {
    case "CREATE_GRID": {
      console.log("grid generated", action.payload);
      return generateGrid(action.payload.participantCount);
    }

    case "UPDATE_FIGHTER": {
      console.log("updated fighter", action.payload);
      const { duelId, color, fighterId } = action.payload;
      const updatedDuel = { [duelId]: { ...state[duelId], [color]: fighterId } };
      return { ...state, ...updatedDuel };
    }

    case "SET_WINNER": {
      console.log("winner has set", action.payload);
      const { duelId, fighterId } = action.payload;
      const updatedDuel = { [duelId]: { ...state[duelId], winner: fighterId } };
      return { ...state, ...updatedDuel };
    }

    default:
      return state;
  }
};

export default gridReducer;
