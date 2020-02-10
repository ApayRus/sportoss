import React from 'react'

import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import { CircularProgress } from '@material-ui/core'
import { participantsGroupedByCategories } from '../../dataFunctions'
import { sortParticipantsByTrainerFrequency } from './functions'

import { map, find } from 'lodash'
import { trainerColors } from '../../config/functions'
import { setGridParameter } from '../../store/gridActions'
import { participantsInGrid } from './playOff/functionsPlayOff'
import Form from './Form'

function FormFirebaseContainer(props) {
  const {
    tournament,
    category,
    grid,
    applications,
    allAthlets,
    allTrainers,
    setGridParameter
    /*
    userId,
    userName,
    userRoles
     grid */
  } = props
  const { categoryId, tournamentId } = props.match.params

  let participants = []

  if (isLoaded(tournament, category, applications, allAthlets, allTrainers)) {
    participants = participantsGroupedByCategories(applications)[categoryId]
    console.log('participantsBeforeSort', participants)
    participants = sortParticipantsByTrainerFrequency(participants)
    console.log('participantsAfterSort', participants)
    const trainerColorMap = trainerColors(participants)
    participants = map(participants).map(elem => {
      const athlet = find(allAthlets, { id: elem.athletId })
      let trainer = find(allTrainers, { id: elem.trainerId })
      const trainerColor = trainer ? trainerColorMap[trainer.id] : 'white'
      trainer = { ...trainer, color: trainerColor }
      return { athlet, trainer }
    })
    setGridParameter({ participants })
    setGridParameter({ tournament })
    setGridParameter({ category })
    setGridParameter({ categoryId })
    setGridParameter({ tournamentId })
    console.log('grid', grid)
    if (grid && grid[categoryId]) {
      const { gridType } = grid[categoryId]
      setGridParameter({ gridType })
      if (gridType === 'group') {
        const { group1grid, group2grid } = grid[categoryId]

        setGridParameter({ group1grid })
        setGridParameter({ group2grid })
        setGridParameter({
          groupParticipants: [
            [...participantsInGrid(group1grid)],
            [...participantsInGrid(group2grid)]
          ]
        })
      } else {
        setGridParameter({ grid: grid[categoryId]['grid'] })
      }
    }

    return <Form />
  } else return <CircularProgress />
}

const mapStateToProps = state => {
  const userId = state.firebase.auth.uid
  const userName = state.firebase.profile.username
  const userRoles = state.firebase.profile.roles

  const { tournament, category, grid } = state.firestore.data
  const { allAthlets, allTrainers, applications } = state.firestore.ordered

  return {
    tournament,
    category,
    grid,
    allAthlets,
    allTrainers,
    applications,
    userId,
    userName,
    userRoles
  }
}

const mapDispatchToProps = dispatch => ({
  setGridParameter: payload => dispatch(setGridParameter(payload))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => {
    const { tournamentId, categoryId } = props.match.params
    return [
      { collection: 'tournaments', doc: tournamentId, storeAs: 'tournament' },
      { collection: 'categories', doc: categoryId, storeAs: 'category' },
      { collection: 'grids', doc: `${tournamentId}`, storeAs: 'grid' },
      { collection: 'applications', where: [['tournamentId', '==', tournamentId]] },
      { collection: 'athlets', storeAs: 'allAthlets' },
      { collection: 'trainers', storeAs: 'allTrainers' }
    ]
  })
)(FormFirebaseContainer)
