import groupBy from 'lodash/groupBy'

export function athletName(athlet) {
	if (athlet) {
		const { familyName, firstName } = athlet
		// const name = `${familyName} ${firstName} ${fatherName}`
		return `${familyName} ${firstName}`
	} else return ''
}

export function trainerName(trainer) {
	const { fullName } = trainer
	if (fullName) {
		return fullName
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

/**
 * returns table trainerId-color
 * @param {object[]} participants
 * @example
 * returns {trainerId1: "aqua", trainerId2: "teal" }
 */
export function trainerColors(participants) {
	const trainerColorsMap = {}
	const participantsGroupedByTrainer = groupBy(participants, 'trainerId')
	const trainerIds = Object.keys(participantsGroupedByTrainer)
	const commonHtmlColors = [
		'teal',
		'aqua',
		'green',
		'lime',
		'olive',
		'yellow',
		'maroon',
		'black',
		'gray',
		'silver',
		'purple',
		'fuchsia',
		'navy'
		/* 'white', 'red', 'blue'*/
	]
	trainerIds.forEach((trainerId, index) => {
		trainerColorsMap[trainerId] = commonHtmlColors[index]
	})
	return trainerColorsMap
}
