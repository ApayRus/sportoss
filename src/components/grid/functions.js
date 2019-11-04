import { map, sortBy, countBy } from 'lodash'

export function gridRecommendation(participantCount) {
  if (participantCount < 3) return 'Объединить категории'
  if (3 <= participantCount && participantCount <= 5) return 'Круговая сетка'
  if (6 <= participantCount && participantCount <= 7) return 'Групповая сетка'
  if (participantCount >= 8) return 'Олимпийская сетка'
}

/**
 * trainer with most of participants will be first, then others,
 * it's nesseccery for place participants in the grid far away of each other
 * @param {*} participants
 */
export function sortParticipantsByTrainerFrequency(participants) {
  const trainerIds = map(participants, 'trainerId') // ['t1', 't3', 't1', 't2', 't1', 't2']
  const countsByTrainer = countBy(trainerIds) //{t1: 3, t2: 2, t3: 1}
  const participantsWithTrainerFrequency = participants.map(elem => {
    const trainerFrequency = countsByTrainer[elem.trainerId]
    return { ...elem, trainerFrequency }
  })
  return sortBy(participantsWithTrainerFrequency, ['trainerFrequency', 'trainerId']).reverse()
}
