import gridReducer from "./reducer";

test("createGrid action", () => {
  const stateBefore = {};

  const action = {
    type: "CREATE_GRID",
    payload: { participantCount: 32 }
  };

  const stateAfter = {
    /* 1st tour */
    1: { next: 17, level: 1 },
    2: { next: 17, level: 1 },
    3: { next: 18, level: 1 },
    4: { next: 18, level: 1 },
    5: { next: 19, level: 1 },
    6: { next: 19, level: 1 },
    7: { next: 20, level: 1 },
    8: { next: 20, level: 1 },
    9: { next: 21, level: 1 },
    10: { next: 21, level: 1 },
    11: { next: 22, level: 1 },
    12: { next: 22, level: 1 },
    13: { next: 23, level: 1 },
    14: { next: 23, level: 1 },
    15: { next: 24, level: 1 },
    16: { next: 24, level: 1 },
    /** 2nd tour */
    17: { next: 25, level: 2 },
    18: { next: 25, level: 2 },
    19: { next: 26, level: 2 },
    20: { next: 26, level: 2 },
    21: { next: 27, level: 2 },
    22: { next: 27, level: 2 },
    23: { next: 28, level: 2 },
    24: { next: 28, level: 2 },
    /* 3rd tour */

    25: { next: 29, level: 3 },
    26: { next: 29, level: 3 },
    27: { next: 30, level: 3 },
    28: { next: 30, level: 3 },
    /* 4th tour */
    29: { next: 31, level: 4 },
    30: { next: 31, level: 4 },
    /* 5th tour */

    31: { next: 0, level: 5 }
  };

  /*
      deepFreeze(stateBefore);
      deepFreeze(action);

      */

  expect(gridReducer(stateBefore, action)).toEqual(stateAfter);
});

test("updateFighter action", () => {
  const stateBefore = {
    /* 1st tour */
    1: { next: 17, level: 1 },
    2: { next: 17, level: 1 },
    3: { next: 18, level: 1 },
    4: { next: 18, level: 1 },
    5: { next: 19, level: 1 },
    6: { next: 19, level: 1 },
    7: { next: 20, level: 1 },
    8: { next: 20, level: 1 },
    9: { next: 21, level: 1 },
    10: { next: 21, level: 1 },
    11: { next: 22, level: 1 },
    12: { next: 22, level: 1 },
    13: { next: 23, level: 1 },
    14: { next: 23, level: 1 },
    15: { next: 24, level: 1 },
    16: { next: 24, level: 1 },
    /** 2nd tour */
    17: { next: 25, level: 2 },
    18: { next: 25, level: 2 },
    19: { next: 26, level: 2 },
    20: { next: 26, level: 2 },
    21: { next: 27, level: 2 },
    22: { next: 27, level: 2 },
    23: { next: 28, level: 2 },
    24: { next: 28, level: 2 },
    /* 3rd tour */

    25: { next: 29, level: 3 },
    26: { next: 29, level: 3 },
    27: { next: 30, level: 3 },
    28: { next: 30, level: 3 },
    /* 4th tour */
    29: { next: 31, level: 4 },
    30: { next: 31, level: 4 },
    /* 5th tour */

    31: { next: 0, level: 5 }
  };

  const action = {
    type: "UPDATE_FIGHTER",
    payload: { duelId: 8, color: "red", fighterId: "djdjdjdjdj" }
  };

  const stateAfter = {
    /* 1st tour */
    1: { next: 17, level: 1 },
    2: { next: 17, level: 1 },
    3: { next: 18, level: 1 },
    4: { next: 18, level: 1 },
    5: { next: 19, level: 1 },
    6: { next: 19, level: 1 },
    7: { next: 20, level: 1 },
    8: { next: 20, level: 1, red: "djdjdjdjdj" },
    9: { next: 21, level: 1 },
    10: { next: 21, level: 1 },
    11: { next: 22, level: 1 },
    12: { next: 22, level: 1 },
    13: { next: 23, level: 1 },
    14: { next: 23, level: 1 },
    15: { next: 24, level: 1 },
    16: { next: 24, level: 1 },
    /** 2nd tour */
    17: { next: 25, level: 2 },
    18: { next: 25, level: 2 },
    19: { next: 26, level: 2 },
    20: { next: 26, level: 2 },
    21: { next: 27, level: 2 },
    22: { next: 27, level: 2 },
    23: { next: 28, level: 2 },
    24: { next: 28, level: 2 },
    /* 3rd tour */

    25: { next: 29, level: 3 },
    26: { next: 29, level: 3 },
    27: { next: 30, level: 3 },
    28: { next: 30, level: 3 },
    /* 4th tour */
    29: { next: 31, level: 4 },
    30: { next: 31, level: 4 },
    /* 5th tour */

    31: { next: 0, level: 5 }
  };

  /*
      deepFreeze(stateBefore);
      deepFreeze(action);

      */

  expect(gridReducer(stateBefore, action)).toEqual(stateAfter);
});

test("setWinner action", () => {
  const stateBefore = {
    /* 1-st tour*/
    1: { next: 5, level: 1 },
    2: { next: 5, level: 1 },
    3: { next: 6, level: 1 },
    4: { next: 6, level: 1 },
    /* 2-nd tour */
    5: { next: 7, level: 2 },
    6: { next: 7, level: 2 },
    /* 3-rd tour */
    7: { next: 0, level: 3 }
  };

  const action = {
    type: "SET_WINNER",
    payload: { duelId: 3, fighterId: "cccdddeee" }
  };

  const stateAfter = {
    /* 1-st tour*/
    1: { next: 5, level: 1 },
    2: { next: 5, level: 1 },
    3: { next: 6, level: 1, winner: "cccdddeee" },
    4: { next: 6, level: 1 },
    /* 2-nd tour */
    5: { next: 7, level: 2 },
    6: { next: 7, level: 2 },
    /* 3-rd tour */
    7: { next: 0, level: 3 }
  };

  /*
      deepFreeze(stateBefore);
      deepFreeze(action);
      */

  expect(gridReducer(stateBefore, action)).toEqual(stateAfter);
});
