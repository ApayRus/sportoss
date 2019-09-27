import React, { Component } from 'react'

import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import { CircularProgress, Select, Typography } from '@material-ui/core'
import { participantsGroupedByCategories } from '../../dataFunctions'
import { map, sortBy, find } from 'lodash'
import { gridByLevels } from './functions'

import { athletName, categoryName, trainerName, tournamentName } from '../../config/functions'
import Grid from './Grid'

export class Page extends Component {
  handleChange = e => {
    console.log('e.target.id', e.target.id)
    console.log('e.target', e.target)
    console.log('e.target.value', e.target.value)
    /*     this.setState({
      [e.target.dataset.id]: e.target.value
    }) */
  }

  render() {
    const { tournament, category, applications, allAthlets, allTrainers, grid } = this.props
    const { categoryId } = this.props.match.params
    let participants = []
    let Participants = []

    if (isLoaded(applications, category, allAthlets, allTrainers)) {
      participants = participantsGroupedByCategories(applications)[categoryId]
      participants = sortBy(participants, 'trainerId')

      participants = map(participants).map(elem => {
        const athlet = find(allAthlets, { id: elem.athletId })
        const trainer = find(allTrainers, { id: elem.trainerId })
        return { athlet, trainer }
      })

      Participants = () => {
        return (
          <div
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            {participants.map(elem => (
              <Typography variant='body1'>
                {athletName(elem.athlet)} ({trainerName(elem.trainer)}){' '}
              </Typography>
            ))}
          </div>
        )
      }
    }

    return (
      <div>
        {isLoaded(tournament, category, allAthlets, allTrainers, applications) ? (
          <div>
            <h1>Форма категории</h1>
            <h2>{categoryName(category)}</h2>
            <h3>{tournamentName(tournament)}</h3>
            <Select
              onChange={this.handleChange}
              native
              inputProps={{
                id: 'tossType'
              }}
            >
              <option value=''></option>
              <option value='playOff'>Олимпийская</option>
              <option value='circle'>Круговая</option>
              <option value='group'>Групповая</option>
            </Select>

            <Typography variant='h6'>Сетка</Typography>
            <div style={{ display: 'flex' }}>
              <Participants />
              <Grid grid={gridByLevels(grid)} />
            </div>
          </div>
        ) : (
          <CircularProgress />
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const userId = state.firebase.auth.uid
  const userName = state.firebase.profile.username

  return {
    tournament: state.firestore.data.tournament,
    category: state.firestore.data.category,
    allAthlets: state.firestore.ordered.allAthlets,
    allTrainers: state.firestore.ordered.allTrainers,
    applications: state.firestore.ordered.applications,
    grid: state.grid.grid,
    user: { userId, userName }
  }
}

export default compose(
  connect(mapStateToProps),
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
)(Page)
