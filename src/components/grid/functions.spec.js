import { sortParticipantsByTrainerFrequency } from './functions'

it('sortParticipantsByTrainerFrequency', () => {
  const beforeSorting = [
    {
      athletId: 'a1',
      trainerId: 't1'
    },
    {
      athletId: 'a2',
      trainerId: 't3'
    },
    {
      athletId: 'a3',
      trainerId: 't1'
    },
    {
      athletId: 'a4',
      trainerId: 't2'
    },
    {
      athletId: 'a5',
      trainerId: 't1'
    },
    {
      athletId: 'a6',
      trainerId: 't2'
    }
  ]
  const afterSorting = [
    {
      athletId: 'a5',
      trainerFrequency: 3,
      trainerId: 't1'
    },
    {
      athletId: 'a3',
      trainerFrequency: 3,
      trainerId: 't1'
    },
    {
      athletId: 'a1',
      trainerFrequency: 3,
      trainerId: 't1'
    },
    {
      athletId: 'a6',
      trainerFrequency: 2,
      trainerId: 't2'
    },
    {
      athletId: 'a4',
      trainerFrequency: 2,
      trainerId: 't2'
    },
    {
      athletId: 'a2',
      trainerFrequency: 1,
      trainerId: 't3'
    }
  ]

  expect(sortParticipantsByTrainerFrequency(beforeSorting)).toEqual(afterSorting)
})
