import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Select, Typography } from '@material-ui/core'
import { participantsInGrid } from './functionsPlayOff'
import { categoryName, tournamentName } from '../../config/functions'
import GridPlayOff from './GridPlayOff'
import GridAllPlayAll from './GridAllPlayAll'
import TopPlaces from './TopPlaces'
import { setGridParameter, createGrid } from '../../store/gridActions'
import Participants from './Participants'

function Form(props) {
  const {
    tournament,
    category,
    participants,
    trainerColorMap,
    gridType,
    grid,
    setGridParameter,
    createGrid
  } = props

  //in playOff grid we want to hide participants who alredy in greed
  const participantsAlredyInGrid = gridType === 'playOff' ? participantsInGrid(grid) : new Set()
  const participantsParams = { participants, participantsAlredyInGrid, trainerColorMap }

  const handleChange = e => {
    const gridType = e.target.value
    setGridParameter({ gridType })
    if (gridType === 'playOff') {
      const participantCount = participants.length
      createGrid({ gridType, participantCount })
    }
    if (gridType === 'allPlayAll') {
      const participantIds = participants.map(elem => elem.athlet.id)
      createGrid({ gridType, participantIds })
    }
  }

  return (
    <div>
      <h1>Форма категории</h1>
      <h2>{categoryName(category)}</h2>
      <h3>{tournamentName(tournament)}</h3>
      <Select
        onChange={handleChange}
        native
        inputProps={{
          id: 'gridType'
        }}
      >
        <option value=''></option>
        <option value='playOff'>Олимпийская</option>
        <option value='allPlayAll'>Круговая</option>
        <option value='group'>Групповая</option>
      </Select>

      <Typography variant='h6'>Сетка</Typography>
      {/* columns: participants | level-0 | level-1 | ... */}
      <div style={{ display: 'flex' }}>
        <Participants {...participantsParams} />
        {gridType === 'playOff' && (
          <Fragment>
            <GridPlayOff />
            <TopPlaces grid={grid} participants={participants} />
          </Fragment>
        )}
        {gridType === 'allPlayAll' && <GridAllPlayAll />}
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  const { tournament, category, participants, trainerColorMap, grid, gridType } = state.grid
  return {
    tournament,
    category,
    participants,
    trainerColorMap,
    gridType,
    grid
  }
}

const mapDispatchToProps = dispatch => ({
  setGridParameter: payload => dispatch(setGridParameter(payload)),
  createGrid: payload => dispatch(createGrid(payload))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form)
