import groupBy from 'lodash/groupBy'
import size from 'lodash/size'

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

  return { byCategories, count }
}
