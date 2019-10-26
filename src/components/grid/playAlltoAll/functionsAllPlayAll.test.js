import { rotateClockwiseAllExcept1, generateGridAllPlayAll } from './functionsAllPlayAll'

it('rotateClockwiseAllExcept1', () => {
  const array8_1 = [],
    array8_2 = [],
    array6_1 = [],
    array6_2 = []

  array8_1[0] = [1, 2, 3, 4]
  array8_2[0] = [8, 7, 6, 5]

  array8_1[1] = [1, 3, 4, 5]
  array8_2[1] = [2, 8, 7, 6]

  array6_1[0] = [1, 2, 3]
  array6_2[0] = [6, 5, 4]

  array6_1[1] = [1, 3, 4]
  array6_2[1] = [2, 6, 5]
  expect(rotateClockwiseAllExcept1(array8_1[0], array8_2[0])).toEqual([array8_1[1], array8_2[1]])
  expect(rotateClockwiseAllExcept1(array6_1[0], array6_2[0])).toEqual([array6_1[1], array6_2[1]])
})

it('generateGridAllPlayAll', () => {
  const athletIds4 = [1, 2, 3, 4]
  // const grid4 = [[[1, 3], [2, 4]], [[1, 2], [4, 3]], [[1, 4], [3, 2]]]
  const grid4 = {
    1: { level: 1, fighterRed: 1, fighterBlue: 3 },
    2: { level: 1, fighterRed: 2, fighterBlue: 4 },
    3: { level: 2, fighterRed: 1, fighterBlue: 2 },
    4: { level: 2, fighterRed: 4, fighterBlue: 3 },
    5: { level: 3, fighterRed: 1, fighterBlue: 4 },
    6: { level: 3, fighterRed: 3, fighterBlue: 2 }
  }
  const athletIds3 = [1, 2, 3]
  //   const grid3 = [[[1, 3]], [[1, 2]], [[3, 2]]]
  const grid3 = {
    1: { level: 1, fighterRed: 1, fighterBlue: 3 },
    2: { level: 2, fighterRed: 1, fighterBlue: 2 },
    3: { level: 3, fighterRed: 3, fighterBlue: 2 }
  }
  expect(generateGridAllPlayAll(athletIds3)).toEqual(grid3)
  expect(generateGridAllPlayAll(athletIds4)).toEqual(grid4)
})
