import React from 'react'
import { connect } from 'react-redux'
import { Select, Typography } from '@material-ui/core'
import { gridByLevels } from './functions'
import { athletName, categoryName, trainerName, tournamentName } from '../../config/functions'
import Grid from './Grid'
import { setGridParameter, createGrid } from '../../store/gridActions'

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

function Form(props) {
  const {
    tournament,
    category,
    participants,
    trainerColorMap,
    grid,
    setGridParameter,
    createGrid
  } = props

  const handleChange = e => {
    setGridParameter({ tossType: e.target.value })
    createGrid({ participantCount: participants.length })
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
                <Typography variant='body1' style={{ display: 'inline-block' }}>
                  {athletName(elem.athlet)}
                </Typography>
              </div>
            )
          })}
        </div>
        <Grid grid={gridByLevels(grid)} />
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  const { tournament, category, participants, trainerColorMap, grid } = state.grid
  return {
    tournament,
    category,
    participants,
    trainerColorMap,
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
