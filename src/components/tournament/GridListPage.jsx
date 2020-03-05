import React from 'react'

import { IconButton, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { categoryName } from '../../config/functions'
import { summarizeTournamentParticipants } from '../../dataFunctions'
import { participantCountByAges } from '../../dataFunctions'
import CategoriesTable from '../layouts/table/Table'
import GridIcon from '@material-ui/icons/GridOn'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

const columns = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Категория' },
  { id: 'participantsCount', numeric: false, disablePadding: false, label: 'Участников' },
  { id: 'grid', numeric: false, disablePadding: false, label: 'Сетка' }
]

const useStyles = makeStyles(theme => ({
  existingGrid: {
    color: theme.palette.primary.main
  }
}))

export function Page(props) {
  const { tournament, allCategories, applications, grids, profile } = props
  const categories = allCategories.filter(cat => tournament.categories.includes(cat.id))
  const tournamentParticipantsInfo = summarizeTournamentParticipants(applications)
  const participantsByCategories = tournamentParticipantsInfo.byCategories
  const participantsCount = tournamentParticipantsInfo.count
  const participantsByAges = participantCountByAges(applications, allCategories)

  const classes = useStyles()

  const categoryGridLink = (tournamentId, categoryId) => (
    <IconButton
      component={Link}
      to={`/grid/club/${profile.club}/tournament/${tournamentId}/category/${categoryId}/`}
    >
      <GridIcon className={clsx({ [classes.existingGrid]: grids[categoryId] })} />
    </IconButton>
  )

  const categoriesTableData = categories.map(cat => {
    const categoryParticipants = participantsByCategories[cat.id]
    const participantsCount = categoryParticipants ? categoryParticipants.length : 0
    const grid = categoryGridLink(tournament.id, cat.id)
    return { id: cat.id, name: categoryName(cat), participantsCount, grid }
  })

  return (
    <div>
      <div style={{ marginLeft: 20 }}>
        <h1>{`${tournament.name}, ${tournament.address}, ${tournament.date}`}</h1>
        <Typography variant='body1'>Всего участников: {participantsCount}</Typography>
        {participantsByAges.map(elem => (
          <Typography key={`participant-by-age-${elem.age}`} variant='body2'>
            от {elem.age} лет - {elem.count}
          </Typography>
        ))}
      </div>
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
