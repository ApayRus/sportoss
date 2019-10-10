import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { find } from 'lodash'
import { athletName, trainerName } from '../../config/functions'
import { updateFighter, setWinner } from '../../store/gridActions'

const styles = {
  duel: {
    width: 200,
    border: '1px solid gray',
    borderRadius: 5,
    marginBottom: 5
  },
  duelNumber: {
    minWidth: 30,
    borderRight: '1px solid gray',
    textAlign: 'center',
    color: 'slategray'
  },
  athletRed: { width: 137, borderBottom: '1px solid gray' },
  athletBlue: { width: 137 },
  athletInput: { width: '100%', border: 'none' },
  winnerRed: { borderBottom: '1px solid gray' },
  trainer: { color: 'gray', fontSize: 10 }
}

function DuelSimple(props) {
  const { duelData, classes, participants, grid, updateFighter, setWinner } = props
  const { id, fighterRed, fighterBlue, winner } = duelData
  let athletRedName,
    athletBlueName,
    trainerRedName,
    trainerBlueName = ''

  if (fighterRed) {
    const participantRedPopulated = find(participants, { athlet: { id: fighterRed } })
    athletRedName = athletName(participantRedPopulated.athlet)
    trainerRedName = trainerName(participantRedPopulated.trainer)
  }

  if (fighterBlue) {
    const participantBluePopulated = find(participants, { athlet: { id: fighterBlue } })
    athletBlueName = athletName(participantBluePopulated.athlet)
    trainerBlueName = trainerName(participantBluePopulated.trainer)
  }

  const onFighterChange = e => {
    const { id: duelId, color: fighterColor } = e.target.dataset
    const [familyName, firstName] = e.target.value.split(' ')

    const relatedParticipant = find(participants, { athlet: { familyName, firstName } })
    const athletId = relatedParticipant ? relatedParticipant.athlet.id : ''
    updateFighter({ duelId, fighterColor, athletId })
  }

  const onWinnerChange = e => {
    const athletId = e.target.checked ? e.target.dataset.winner : ''
    const duelId = id
    setWinner({ duelId, athletId })
    const duelNextId = grid[duelId].next
    if (duelNextId) {
      const duelNext = grid[duelNextId]
      const fighterColor = duelNext.fighterRed ? 'Blue' : 'Red'
      updateFighter({ duelId: duelNextId, fighterColor, athletId })
    }
  }

  return (
    <table className={classes.duel}>
      <tbody>
        <tr>
          <td className={classes.duelNumber} rowSpan='2'>
            {id}
          </td>
          <td className={classes.athletRed}>
            <input
              onChange={onFighterChange}
              type='text'
              placeholder='red'
              data-id={id}
              data-color='Red'
              className={classes.athletInput}
              value={athletRedName}
            />
            <div className={classes.trainer}>{trainerRedName}</div>
          </td>
          <td className={classes.winnerRed}>
            <Checkbox
              inputProps={{ 'data-winner': fighterRed }}
              onChange={onWinnerChange}
              style={{ width: 7, height: 7, color: 'red' }}
              checked={winner === fighterRed && winner ? true : false}
            />
          </td>
        </tr>
        <tr>
          <td className={classes.athletBlue}>
            <input
              onChange={onFighterChange}
              type='text'
              placeholder='blue'
              data-id={id}
              data-color='Blue'
              className={classes.athletInput}
              value={athletBlueName}
            />
            <div className={classes.trainer}>{trainerBlueName}</div>
          </td>
          <td className={classes.winnerBlue}>
            <Checkbox
              inputProps={{ 'data-winner': fighterBlue }}
              onChange={onWinnerChange}
              style={{ width: 7, height: 7, color: 'blue' }}
              checked={winner === fighterBlue && winner ? true : false}
            />
          </td>
        </tr>
      </tbody>
    </table>
  )
}

const mapStateToProps = state => ({
  participants: state.grid.participants,
  grid: state.grid.grid
})

const mapDispatchToProps = dispatch => ({
  updateFighter: payload => dispatch(updateFighter(payload)),
  setWinner: payload => dispatch(setWinner(payload))
})

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DuelSimple)
