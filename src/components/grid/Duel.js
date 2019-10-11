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
  duelLabel: {
    fontSize: 9
  },
  athletRed: { width: 137, borderBottom: '1px solid gray' },
  athletBlue: { width: 137 },
  athletInput: { width: '100%', border: 'none' },
  winnerRed: { borderBottom: '1px solid gray' },
  trainer: { color: 'gray', fontSize: 10 }
}

function DuelSimple(props) {
  const { duelData, classes, participants, grid, updateFighter, setWinner } = props
  const { id, fighterRed, fighterBlue, winner, label } = duelData
  let athletRedName,
    athletBlueName,
    trainerRedName,
    trainerBlueName = ''

  //populate fighters data by id
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
    const winnerId = e.target.checked ? e.target.dataset.winner : ''
    const duelId = id
    const duel = grid[duelId]
    setWinner({ duelId, athletId: winnerId })

    const fillNextRoundByWinners = () => {
      //winner goes to the next round (level)
      const duelNextId = duel.next
      if (duelNextId) {
        const duelNext = grid[duelNextId]
        const fighterColor = duelNext.fighterRed ? 'Blue' : 'Red'
        updateFighter({ duelId: duelNextId, fighterColor, athletId: winnerId })
      }
    }

    const fillDuelFor3rdPlaceByLosers = () => {
      //in 1/2 finals, loser goes to Duel for 3rd place, also it is a last Duel in Grid
      const duelTotalCount = Object.keys(grid).length
      const { fighterRed, fighterBlue } = duel
      const loserId = winnerId === fighterRed ? fighterBlue : fighterRed

      if (+duelId === duelTotalCount - 3)
        //1-st of 1/2 finals
        updateFighter({ duelId: duelTotalCount, fighterColor: 'Red', athletId: loserId })
      if (+duelId === duelTotalCount - 2)
        //2-nd of 1/2 finals
        updateFighter({ duelId: duelTotalCount, fighterColor: 'Blue', athletId: loserId })
    }

    fillNextRoundByWinners()
    fillDuelFor3rdPlaceByLosers()
  }

  return (
    <table className={classes.duel}>
      <tbody>
        <tr>
          <td className={classes.duelNumber} rowSpan='2'>
            {id}
            {label ? <div className={classes.duelLabel}>{label}</div> : ''}
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
