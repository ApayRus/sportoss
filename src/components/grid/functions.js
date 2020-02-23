import { map, sortBy, countBy, groupBy } from 'lodash'

export function gridRecommendation(participantCount) {
  if (participantCount < 3) return 'Объединить категории'
  if (3 <= participantCount && participantCount <= 5) return 'Круговая сетка'
  if (6 <= participantCount && participantCount <= 7) return 'Групповая сетка'
  if (participantCount >= 8) return 'Олимпийская сетка'
}

/**
 * trainer with most of participants will be first, then others,
 * it's necessary for place participants in the grid far away of each other
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

/**
 * gets array of objects [{athlet:{id:"id1"}, trainer}, ...]
 * and returns array of arrays with ids [['id1', 'id2',...], [...]]
 *
 */
export function participantIdsGroupedByTrainer(participants) {
  const groupedByTrainer = groupBy(participants, 'trainer.id')
  const resultArray = map(groupedByTrainer, elem => {
    return map(elem, 'athlet.id')
  })
  return resultArray
}

/**
 *
 * @param {number} min - inclusive
 * @param {number} max - exclusively
 * @return {number}
 * @example
 * getRandomInt(0, 10) // any of numbers 0-9
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * 
 * @param {any[]} array 
 * @example
 getRandomElementFromArray('x', 'y', 'z') // x or y or z, one of them 
 */
export function getRandomElementFromArray(array) {
  const index = getRandomInt(0, array.length)
  return array[index]
}
