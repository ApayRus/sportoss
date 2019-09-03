import { ageAtDate } from './functions'

it('ageAtDate', () => {
  const inputArray = [
    ['1984-10-25', '2019-10-25', 34],
    ['1984-10-25', '2019-10-26', 35],
    ['1987-05-14', '2019-05-14', 31],
    ['1987-05-14', '2019-05-15', 32]
  ]

  inputArray.forEach(elem => {
    const [birthday, date, expectedAge] = elem
    expect(ageAtDate(birthday, date)).toEqual(expectedAge)
  })
})
