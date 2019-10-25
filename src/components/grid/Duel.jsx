import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Checkbox, Box } from '@material-ui/core'
import { find } from 'lodash'
import { athletName, trainerName } from '../../config/functions'

const styles = {
  duel: {
    /* width: 200, */
    border: '1px solid gray',
    borderRadius: 5,
    marginBottom: 5
  },
  duelNumber: {
    width: 30,
    borderRight: '1px solid gray',
    textAlign: 'center',
    color: 'slategray'
  },
  duelLabel: {
    fontSize: 9
  },
  athletRed: { width: 140, height: 33, borderBottom: '1px solid gray' },
  athletBlue: { width: 140, height: 33 },
  athletInput: { width: '100%', border: 'none' },
  winnerRed: { height: 33, borderBottom: '1px solid gray' },
  winnerBlue: {
    /* height: 33  */
  },
  trainer: { color: 'gray', fontSize: 10 }
}

function DuelSimple(props) {
  const { duelData, classes, participants, onFighterChange, onWinnerChange } = props
  const { id, fighterRed, fighterBlue, winner, label } = duelData
  let athletRedName, athletBlueName, trainerRedName, trainerBlueName

  //populate fighters data by id
  if (fighterRed) {
    const participantRedPopulated = find(participants, { athlet: { id: fighterRed } })
    athletRedName = athletName(participantRedPopulated.athlet)
    trainerRedName = trainerName(participantRedPopulated.trainer)
  } else {
    athletRedName = ''
  }
  if (fighterBlue) {
    const participantBluePopulated = find(participants, { athlet: { id: fighterBlue } })
    athletBlueName = athletName(participantBluePopulated.athlet)
    trainerBlueName = trainerName(participantBluePopulated.trainer)
  } else {
    athletBlueName = ''
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
              onChange={onFighterChange(id)}
              type='text'
              data-id={id}
              data-color='Red'
              className={classes.athletInput}
              value={athletRedName}
            />
            <div className={classes.trainer}>{trainerRedName}</div>
          </td>
          <Box displayPrint='none'>
            <td className={classes.winnerRed}>
              <Checkbox
                inputProps={{ 'data-winner': fighterRed }}
                onChange={onWinnerChange(id)}
                style={{ width: 7, height: 7, color: 'red' }}
                checked={winner === fighterRed && winner ? true : false}
              />
            </td>
          </Box>
        </tr>
        <tr>
          <td className={classes.athletBlue}>
            <input
              onChange={onFighterChange(id)}
              type='text'
              data-id={id}
              data-color='Blue'
              className={classes.athletInput}
              value={athletBlueName}
            />
            <div className={classes.trainer}>{trainerBlueName}</div>
          </td>
          <Box displayPrint='none'>
            <td className={classes.winnerBlue}>
              <Checkbox
                inputProps={{ 'data-winner': fighterBlue }}
                onChange={onWinnerChange(id)}
                style={{ width: 7, height: 7, color: 'blue' }}
                checked={winner === fighterBlue && winner ? true : false}
              />
            </td>
          </Box>
        </tr>
      </tbody>
    </table>
  )
}

export default withStyles(styles)(DuelSimple)
