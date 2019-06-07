import { getBaseLog, gridTourDuelCount } from "./functions"

it("getBaseLog", () => {
  expect(getBaseLog(2, 1)).toEqual(0)
  expect(getBaseLog(2, 8)).toEqual(3)
  expect(getBaseLog(2, 64)).toEqual(6)
})

it("gridTourDuelCount", () => {
  expect(gridTourDuelCount(10)).toEqual([2, 4, 2, 1])
  expect(gridTourDuelCount(32)).toEqual([16, 8, 4, 2, 1])
  expect(gridTourDuelCount(555)).toEqual([43, 256, 128, 64, 32, 16, 8, 4, 2, 1])
})
