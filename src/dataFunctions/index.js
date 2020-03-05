import { map, groupBy, size } from 'lodash'

/**
 * Gets applications of Tournament and returns Participans, grouped by Categories
 * @applications {array}
 */
export function participantsGroupedByCategories(applications) {
  let participants = {}
  applications.forEach(app => {
    participants = { ...participants, ...app.participants }
  })
  return groupBy(participants, 'categoryId')
}

export function summarizeTournamentParticipants(applications) {
  let participants = {}
  applications.forEach(app => {
    participants = { ...participants, ...app.participants }
  })
  const byCategories = groupBy(participants, 'categoryId')
  const count = size(participants)

  return { byCategories, count, participants }
}

/**
 * 
 * @param {object[]} applications 
 * @param {object} categories 
 * @example 
 * returns 
 * [ 
    { "age": "8", "count": 58 },
    { "age": "10", "count": 64 },
    { "age": "12", "count": 38 },
    { "age": "14", "count": 35 },
    { "age": "16", "count": 9 }
] 
 */
export function participantCountByAges(applications, categories) {
  const categoriesArray = map(categories, (elem, key) => ({
    id: key,
    ...elem
  }))

  const categoriesGroupedByMinAge = groupBy(categoriesArray, 'minAge')

  Object.keys(categoriesGroupedByMinAge).map(
    key => (categoriesGroupedByMinAge[key] = map(categoriesGroupedByMinAge[key], 'id'))
  )

  const applicationsOnlyCategories = applications
    .map(application => {
      const { participants } = application
      const categories = Object.keys(participants).map(key => participants[key]['categoryId'])
      return categories
    })
    .flat()

  const participantsByAges = Object.keys(categoriesGroupedByMinAge)
    .map(age => {
      const count = applicationsOnlyCategories.filter(elem =>
        categoriesGroupedByMinAge[age].includes(elem)
      ).length
      return { age, count }
    })
    .filter(elem => elem.count > 0)

  return participantsByAges
}
