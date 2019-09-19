export function categoryName(category) {
  const { gender, minAge, maxAge, weight } = category
  const name = `${gender}, ${minAge}-${maxAge} лет, ${weight}`
  return name
}

export function athletName(athlet) {
  const { familyName, firstName, fatherName } = athlet
  // const name = `${familyName} ${firstName} ${fatherName}`
  const name = `${familyName} ${firstName}`
  return name
}

export function trainerName(trainer) {
  const { familyName, firstName, fatherName } = trainer
  // const name = `${familyName} ${firstName} ${fatherName}`
  const name = `${familyName} ${firstName[0]}. ${fatherName[0]}.`
  return name
}

export function tournamentName(tournament) {
  const { name, date, address } = tournament
  return `${name}, ${date}, ${address}`
}

/**
 *
 * @param {string} birthday
 * @param {string} date
 * @returns {number} age
 * @example
 * ageAtDate('1987-05-14', '2019-05-15') // 32
 */
export function ageAtDate(birthday, date) {
  const [birthYear, birthMonth, birthDay] = birthday.split('-')
  const [dateYear, dateMonth, dateDay] = date.split('-')

  let answer = dateYear - birthYear //2019-1984 = 35
  if (dateMonth > birthMonth) {
    return answer
  }
  if (dateMonth < birthMonth) {
    answer--
    return answer
  }
  if (dateMonth === birthMonth) {
    if (dateDay <= birthDay) answer--
    return answer
  }
}
