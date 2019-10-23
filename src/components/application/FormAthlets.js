import React from 'react'
import { ageAtDate } from '../../config/functions'
import { athletName, categoryName, trainerName } from '../../config/functions'
import Select from './Select'

//prepare table with Selects :
//| id | participantName | CategorySelect | TrainerSelect |
const athletsWithCategoriesTrainers = (
  athlets,
  categories,
  tournaments,
  trainers,
  tournamentId,
  participants,
  handleChangeCategory,
  handleChangeTrainer
) => {
  return athlets.map(athlet => {
    const participant = participants[athlet.id] || {}
    const { categoryId, trainerId } = participant

    let categoriesForSelect = categories
    const tournament = tournaments.find(elem => elem.id === tournamentId)
    if (tournament) {
      const athletAge = ageAtDate(athlet.birthday, tournament.dateAge || tournament.date)
      // applies 3 filters to allCategories: 1) selected for tournament, 2) gender, 3) age from [minAge, maxAge]
      categoriesForSelect = categories.filter(cat => {
        let { minAge, maxAge } = cat
        if (!minAge) minAge = 0
        if (!maxAge) maxAge = 100
        return (
          tournament.categories.includes(cat.id) &&
          athlet.gender === cat.gender &&
          (athletAge >= +minAge && athletAge <= +maxAge)
        )
      })
    }

    const CategorySelect = (
      <Select
        value={categoryId}
        data={categoriesForSelect}
        handleChange={handleChangeCategory(athlet.id)}
        nameFunction={categoryName}
      />
    )

    const TrainerSelect = (
      <Select
        value={trainerId}
        data={trainers}
        handleChange={handleChangeTrainer(athlet.id)}
        nameFunction={trainerName}
      />
    )

    return {
      id: athlet.id,
      participant: athletName(athlet),
      category: CategorySelect,
      trainer: TrainerSelect
    }
  })
}

export default athletsWithCategoriesTrainers
