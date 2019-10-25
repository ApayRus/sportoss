export function athletName(athlet) {
  if (athlet) {
    const { familyName, firstName } = athlet
    // const name = `${familyName} ${firstName} ${fatherName}`
    return `${familyName} ${firstName}`
  } else return ''
}

export function trainerName(trainer) {
  if (trainer) {
    const { familyName, firstName, fatherName } = trainer
    // const name = `${familyName} ${firstName} ${fatherName}`
    return `${familyName} ${firstName[0]}. ${fatherName[0]}.`
  } else return ''
}

export function categoryName(category) {
  if (category) {
    const { gender, minAge, maxAge, weight } = category
    return `${gender}, ${minAge}-${maxAge} лет, ${weight}`
  } else return ''
}

export function tournamentName(tournament) {
  if (tournament) {
    const { name, date /* address */ } = tournament
    const localDate = new Date(date).toLocaleDateString('ru')
    return `${name}, ${localDate}`
  } else return ''
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
