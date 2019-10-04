import React from 'react'

import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import { CircularProgress } from '@material-ui/core'
import { participantsGroupedByCategories } from '../../dataFunctions'
import { map, sortBy, find } from 'lodash'
import { trainerColors } from './functions'
import { setGridParameter } from '../../store/gridActions'
import Form from './Form'

function FormFirebaseContainer(props) {
  const {
    tournament,
    category,
    applications,
    allAthlets,
    allTrainers,
    setGridParameter
    /* grid, auth, profile */
  } = props

  const { categoryId } = props.match.params

  let participants = []
  let trainerColorMap = {}

  if (isLoaded(tournament, category, applications, allAthlets, allTrainers /* , auth, profile */)) {
    participants = participantsGroupedByCategories(applications)[categoryId]
    participants = sortBy(participants, 'trainerId')
    trainerColorMap = trainerColors(participants)
    participants = map(participants).map(elem => {
      const athlet = find(allAthlets, { id: elem.athletId })
      const trainer = find(allTrainers, { id: elem.trainerId })
      return { athlet, trainer }
    })
    setGridParameter({ participants })
    setGridParameter({ trainerColorMap })
    setGridParameter({ tournament })
    setGridParameter({ category })

    return <Form />
  } else return <CircularProgress />
}

const mapStateToProps = state => {
  /*   
  const auth = state.firebase.auth
  const profile = state.firebase.profile
  const userId = state.firebase.auth.uid
  const userName = state.firebase.profile.username 
*/

  const { tournament, category } = state.firestore.data
  const { allAthlets, allTrainers, applications } = state.firestore.ordered

  return {
    tournament,
    category,
    allAthlets,
    allTrainers,
    applications,
    grid: state.grid.grid
    /* 
    user: { userId, userName },
    auth,
    profile 
*/
  }
}

const mapDispatchToProps = dispatch => ({
  setGridParameter: payload => dispatch(setGridParameter(payload))
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect(props => {
    const { tournamentId, categoryId } = props.match.params
    return [
      { collection: 'tournaments', doc: tournamentId, storeAs: 'tournament' },
      { collection: 'categories', doc: categoryId, storeAs: 'category' },
      { collection: 'applications', where: [['tournamentId', '==', tournamentId]] },
      { collection: 'athlets', storeAs: 'allAthlets' },
      { collection: 'trainers', storeAs: 'allTrainers' }
    ]
  })
)(FormFirebaseContainer)
