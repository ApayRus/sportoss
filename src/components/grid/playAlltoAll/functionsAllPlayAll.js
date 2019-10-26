/*
ALL PLAY ALL TOURNAMENT (round-robin tournament)
Rotate clockwise all except 1
1	8		1	2		1	3		1	4		1	5		1	6		1	7
2	7	=>  3	8	=>  4	2	=>	5	3	=>	6	4	=>	7	5	=>	8	6
3	6		4	7		5	8		6	2		7	3		8	4		2	5
4	5		5	6		6	7		7	8		8	2		2	3		3	4
duelCount = n*(n-1)/2
tourCount = n%2 ? n : n-1
*/

/**
 *
 * @param {string[]} array1
 * @param {string[]} array2
 * @example
 * const array1 = [1, 2, 3, 4]
 * const array2 = [8, 7, 6, 5]
 * rotateClockwiseAllExcept1(array1, array2) -->
 * [[1, 3, 4, 5], [2, 8, 7, 6]]
 */
export function rotateClockwiseAllExcept1(array1, array2) {
  const n = array1.length
  array2.unshift(array1[1])
  const newArray2 = array2
  const newArray1 = array1.map((elem, index, array) => array[index + 1])
  newArray1[0] = array1[0]
  newArray1[n - 1] = array2[n]
  newArray2.pop()
  return [newArray1, newArray2]
}

/**
   * From given ids array, returns grid (set of tours/duels)
   * @param {string[]} athletIds 
   * @example 
    generateAllPlayAllGrid(['1','2','3','4']) --> 
    {
        1: { level: 1, fighterRed: 1, fighterBlue: 3 },
        2: { level: 1, fighterRed: 2, fighterBlue: 4 },
        3: { level: 2, fighterRed: 1, fighterBlue: 2 },
        4: { level: 2, fighterRed: 4, fighterBlue: 3 },
        5: { level: 3, fighterRed: 1, fighterBlue: 4 },
        6: { level: 3, fighterRed: 3, fighterBlue: 2 }
    }
     generateAllPlayAllGrid(['1','2','3']) --> 
    {
        1: { level: 1, fighterRed: 1, fighterBlue: 3 },
        2: { level: 2, fighterRed: 1, fighterBlue: 2 },
        3: { level: 3, fighterRed: 3, fighterBlue: 2 }
    }
   */
export function generateGridAllPlayAll(athletIds) {
  if (athletIds.length % 2) athletIds.push(0) //fake fighter
  const n = athletIds.length
  const tourCount = n - 1
  // make columns for each tour (with clockwise rotation)
  const column1 = [],
    column2 = []
  column1[0] = athletIds.slice(0, n / 2)
  column2[0] = athletIds.slice(n / 2, n)
  for (let tour = 1; tour < tourCount; tour++) {
    const oldColumn1 = [...column1[tour - 1]]
    const oldColumn2 = [...column2[tour - 1]]
    const [newColumn1, newColumn2] = rotateClockwiseAllExcept1(oldColumn1, oldColumn2)
    column1.push(newColumn1)
    column2.push(newColumn2)
  }

  // make grid with duels from columns
  const grid = {}
  let duelId = 1 //grid global index
  for (let tour = 0; tour < tourCount; tour++) {
    const duelsInTour = n / 2
    for (let duel = 0; duel < duelsInTour; duel++) {
      const fighterRed = column1[tour][duel]
      const fighterBlue = column2[tour][duel]
      if (fighterRed === 0 || fighterBlue === 0) continue //duel with fake fighter "0"
      grid[duelId] = { level: tour + 1, fighterRed, fighterBlue }
      duelId++
    }
  }

  return grid
}
