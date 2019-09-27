import React, { Component } from 'react'

import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import { CircularProgress, Select, Typography } from '@material-ui/core'
import { participantsGroupedByCategories } from '../../dataFunctions'
import { map, sortBy, find } from 'lodash'
import { gridByLevels, trainerColors } from './functions'

import { athletName, categoryName, trainerName, tournamentName } from '../../config/functions'
import Grid from './Grid'

const styles = {
  coloredTrainer: color => {
    return {
      width: 10,
      height: 10,
      backgroundColor: color,
      display: 'inline-block',
      borderRadius: 5,
      marginRight: 3
    }
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
}

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
    let trainerColorMap = {}

    if (isLoaded(applications, category, allAthlets, allTrainers)) {
      participants = participantsGroupedByCategories(applications)[categoryId]
      participants = sortBy(participants, 'trainerId')
      trainerColorMap = trainerColors(participants)
      participants = map(participants).map(elem => {
        const athlet = find(allAthlets, { id: elem.athletId })
        const trainer = find(allTrainers, { id: elem.trainerId })
        return { athlet, trainer }
      })
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
            {/* columns: participants | level-0 | level-1 | ... */}
            <div style={{ display: 'flex' }}>
              <div style={styles.flexColumn}>
                {participants.map(elem => {
                  const trainerColor = trainerColorMap[elem.trainer.id]
                  return (
                    <div key={`participant-${elem.athlet.id}`} style={{ whiteSpace: 'nowrap' }}>
                      <div
                        title={trainerName(elem.trainer)}
                        style={styles.coloredTrainer(trainerColor)}
                      ></div>
                      <Typography variant='body1' inline>
                        {athletName(elem.athlet)}
                      </Typography>
                    </div>
                  )
                })}
              </div>
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
  firestoreConnect(props => {
    const { tournamentId, categoryId } = props.match.params
    return [
      { collection: 'tournaments', doc: tournamentId, storeAs: 'tournament' },
      { collection: 'categories', doc: categoryId, storeAs: 'category' },
      { collection: 'applications', where: [['tournamentId', '==', tournamentId]] },
      { collection: 'athlets', storeAs: 'allAthlets' },
      { collection: 'trainers', storeAs: 'allTrainers' }
    ]
  }),
  connect(mapStateToProps)
)(Page)
