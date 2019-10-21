import React from 'react'

import { IconButton, Typography } from '@material-ui/core'
import { categoryName } from '../../config/functions'
import { summarizeTournamentParticipants } from '../../dataFunctions'
import CategoriesTable from '../layouts/table/Table'
import GridIcon from '@material-ui/icons/GridOn'
import { Link } from 'react-router-dom'

const columns = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Категория' },
  { id: 'participantsCount', numeric: false, disablePadding: false, label: 'Участников' },
  { id: 'grid', numeric: false, disablePadding: false, label: 'Сетка' }
]

export function Page(props) {
  const { tournament, allCategories, applications } = props
  const categories = allCategories.filter(cat => tournament.categories.includes(cat.id))
  const tournamentParticipantsInfo = summarizeTournamentParticipants(applications)
  const participantsByCategories = tournamentParticipantsInfo.byCategories
  const participantsCount = tournamentParticipantsInfo.count

  const gategoryGridLink = (tournamentId, categoryId) => (
    <IconButton component={Link} to={`/grid/tournament/${tournamentId}/category/${categoryId}/`}>
      <GridIcon />
    </IconButton>
  )

  const categoriesTableData = categories.map(cat => {
    const categoryParticipants = participantsByCategories[cat.id]
    const participantsCount = categoryParticipants ? categoryParticipants.length : 0
    const grid = gategoryGridLink(tournament.id, cat.id)
    return { id: cat.id, name: categoryName(cat), participantsCount, grid }
  })

  return (
    <div>
      <h1>{`${tournament.name}, ${tournament.address}, ${tournament.date}`}</h1>
      <Typography variant='body1'>Всего участников: {participantsCount}</Typography>
      <CategoriesTable
        data={categoriesTableData}
        columns={columns}
        collection='categories'
        title='Категории'
        disableRowClick
        hideToolbar
        hideCheckboxes
      />
    </div>
  )
}

export default Page
