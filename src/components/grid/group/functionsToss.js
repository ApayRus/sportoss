import store from '../../../store/rootReducer'
import { setGroupParticipant } from '../../../store/gridActions'
import { participantIdsGroupedByTrainer, getRandomInt } from '../functions'

export function tossGroup() {
  const { participants } = store.getState().grid
  const participantsByTrainer = participantIdsGroupedByTrainer(participants)
  let generalIndex = 0
  participantsByTrainer.forEach(participantsBlock => {
    while (participantsBlock.length > 0) {
      const randomParticipantIndex = getRandomInt(0, participantsBlock.length)
      const participantId = participantsBlock.splice(randomParticipantIndex, 1)[0]
      const groupIndex = generalIndex % 2
      const participantIndex = Math.floor(generalIndex / 2)
      store.dispatch(setGroupParticipant({ groupIndex, participantIndex, participantId }))
      generalIndex++
    }
  })
}
