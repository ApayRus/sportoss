import { getBaseLog, gridTourDuelCount, generateGrid, totalCountDuelsBeforeTour, gridByLevels } from "./functions";

it("getBaseLog", () => {
  expect(getBaseLog(2, 1)).toEqual(0);
  expect(getBaseLog(2, 8)).toEqual(3);
  expect(getBaseLog(2, 64)).toEqual(6);
});

it("gridTourDuelCount", () => {
  expect(gridTourDuelCount(10)).toEqual([2, 4, 2, 1]);
  expect(gridTourDuelCount(32)).toEqual([16, 8, 4, 2, 1]);
  expect(gridTourDuelCount(555)).toEqual([43, 256, 128, 64, 32, 16, 8, 4, 2, 1]);
});

it("totalCountDuelsBeforeTour", () => {
  expect(totalCountDuelsBeforeTour([2, 1])).toEqual([0, 2]);
  expect(totalCountDuelsBeforeTour([4, 2, 1])).toEqual([0, 4, 6]);
  expect(totalCountDuelsBeforeTour([8, 4, 2, 1])).toEqual([0, 8, 12, 14]);
  expect(totalCountDuelsBeforeTour([16, 8, 4, 2, 1])).toEqual([0, 16, 24, 28, 30]);
  expect(totalCountDuelsBeforeTour([32, 16, 8, 4, 2, 1])).toEqual([0, 32, 48, 56, 60, 62]);
});

it("generateGrid", () => {
  const trueAnswer8 = {
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

  expect(generateGrid(8)).toEqual(trueAnswer8);

  const trueAnswer32 = {
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
  expect(generateGrid(32)).toEqual(trueAnswer32);
});

it("gridByLevels", () => {
  const grid8_raw = {
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

  const grid8_byLevels = {
    1: [
      { id: "1", level: 1, next: 5 },
      { id: "2", level: 1, next: 5 },
      { id: "3", level: 1, next: 6 },
      { id: "4", level: 1, next: 6 }
    ],
    2: [{ id: "5", level: 2, next: 7 }, { id: "6", level: 2, next: 7 }],
    3: [{ id: "7", level: 3, next: 0 }]
  };

  expect(gridByLevels(grid8_raw)).toEqual(grid8_byLevels);
});
