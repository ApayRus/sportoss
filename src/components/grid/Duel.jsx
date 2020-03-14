import React from 'react'
import { useDispatch } from 'react-redux'
import { setWinner } from '../../store/gridActions'
import { Checkbox, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { find } from 'lodash'
import { athletName, trainerName } from '../../config/functions'

function DuelSimple(props) {
  const {
    duelData,
    participants,
    onFighterChange = () => {},
    showScoreInput,
    showWinnerCheckbox
  } = props

  const { id, fighterRed, fighterBlue, winner, label /* scoreRed, scoreBlue  */ } = duelData

  const dispatch = useDispatch()

  const onWinnerChange = (duelId, athletId) => e => {
    const operation = e.target.checked ? 'set' : 'reset'
    dispatch(setWinner({ duelId, athletId, operation }))
  }

  const useStyles = makeStyles(theme => ({
    duelTable: props => ({
      /* width: '5cm', */
      border: '1px solid gray',
      borderRadius: 5,
      marginBottom: 5,
      borderSpacing: 0,
      tableLayout: 'fixed',
      opacity: props.duelData.status === 'fake' ? 0 : 1,
      visibility: props.duelData.status === 'fake' ? 'hidden' : 'visible'
    }),
    duelNumber: {
      width: 30,
      borderRight: '1px solid gray',
      textAlign: 'center',
      color: 'slategray'
    },
    duelLabel: {
      fontSize: 9
    },
    athletRed: { width: 140, height: 33, padding: '0 5px', borderBottom: '1px solid gray' },
    athletBlue: { width: 140, height: 33, padding: '0 5px' },
    athletInput: { width: '100%', border: 'none' },
    checkboxColumn: { width: 35, height: 33 },
    checkboxColumnRed: { borderBottom: '1px solid gray' },
    checkboxRed: { width: 7, height: 7, marginTop: 2, color: theme.palette.secondary.main },
    checkboxBlue: { width: 7, height: 7, marginTop: 2, color: theme.palette.primary.main },
    trainer: { color: 'gray', fontSize: 10 },
    athletColorColumn: { width: 5 },
    athletColorRed: { backgroundColor: 'rgba(255,0,0,0.5)', borderBottom: ' 1px solid gray' },
    athletColorBlue: { backgroundColor: 'rgba(0,0,255,0.5)' },
    scoreColumn: { width: 35, borderLeft: ' 1px solid gray' },
    scoreColumnRed: {
      '& input': { color: 'rgba(255,0,0,0.5)', fontWeight: 'bold' },
      borderBottom: ' 1px solid gray'
    },
    scoreColumnBlue: { '& input': { color: 'rgba(0,0,255,0.5)', fontWeight: 'bold' } },
    scoreInput: { border: 'none', width: 31, height: 25, textAlign: 'center' }
  }))

  const classes = useStyles(props)

  let athletRedName, athletBlueName, trainerRedName, trainerBlueName

  const emptyAthlet = { athlet: {}, trainer: {} }

  //populate fighters data by id
  if (fighterRed) {
    const participantRedPopulated =
      find(participants, { athlet: { id: fighterRed } }) || emptyAthlet
    athletRedName = athletName(participantRedPopulated.athlet)
    trainerRedName = trainerName(participantRedPopulated.trainer)
  } else {
    athletRedName = ''
  }
  if (fighterBlue) {
    const participantBluePopulated =
      find(participants, { athlet: { id: fighterBlue } }) || emptyAthlet
    athletBlueName = athletName(participantBluePopulated.athlet)
    trainerBlueName = trainerName(participantBluePopulated.trainer)
  } else {
    athletBlueName = ''
  }

  return (
    <table className={classes.duelTable}>
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
          {showWinnerCheckbox && (
            <td className={`${classes.checkboxColumnRed} ${classes.checkboxColumn}`}>
              <Box displayPrint='none'>
                <Checkbox
                  onChange={onWinnerChange(id, fighterRed)}
                  className={classes.checkboxRed}
                  color='secondary'
                  checked={winner === fighterRed && winner ? true : false}
                />
              </Box>
            </td>
          )}
          {showScoreInput && (
            <td className={`${classes.scoreColumn} ${classes.scoreColumnRed}`}>
              <input className={classes.scoreInput} />
            </td>
          )}
          <td className={`${classes.athletColorRed} ${classes.athletColorColumn}`}></td>
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
          {showWinnerCheckbox && (
            <td className={`${classes.checkboxColumn}`}>
              <Box displayPrint='none'>
                <Checkbox
                  onChange={onWinnerChange(id, fighterBlue)}
                  className={classes.checkboxBlue}
                  color='primary'
                  checked={winner === fighterBlue && winner ? true : false}
                />
              </Box>
            </td>
          )}
          {showScoreInput && (
            <td className={`${classes.scoreColumn} ${classes.scoreColumnBlue}`}>
              <input className={classes.scoreInput} />
            </td>
          )}
          <td className={`${classes.athletColorBlue} ${classes.athletColorColumn}`}></td>
        </tr>
      </tbody>
    </table>
  )
}

export default DuelSimple
