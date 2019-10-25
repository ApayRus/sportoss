import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import { find } from 'lodash'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { setGroupParticipant } from '../../store/gridActions'
import { athletName, trainerName } from '../../config/functions'

function GroupTable(props) {
  //   const groupParticipants = [0, 1, 2]
  const { classes, participants, groupParticipants, setGroupParticipant, groupIndex } = props

  const onParticipantAddedToGroup = participantIndex => e => {
    const [familyName, firstName] = e.target.value.split(' ')
    const relatedParticipant = find(participants, { athlet: { familyName, firstName } })
    const participantId = relatedParticipant ? relatedParticipant.athlet.id : ''
    setGroupParticipant({ groupIndex, participantIndex, participantId })
  }

  const styles0 = {
    coloredTrainer: color => {
      return {
        width: 10,
        height: 10,
        backgroundColor: color,
        display: 'inline-block',
        borderRadius: 5,
        marginRight: 3,
        verticalAlign: 'super'
      }
    }
  }

  return (
    <div className={classes.levelBox}>
      <Box displayPrint='none'>
        <table className={classes.groupTable}>
          <thead>
            <tr>
              <th>Группа - {groupIndex + 1}</th>
              <th title='Побед'>П</th>
            </tr>
          </thead>
          <tbody>
            {groupParticipants[groupIndex].map((id, participantIndex) => {
              const relatedParticipant = find(participants, { athlet: { id } })
              let participantName, participantTrainerName, trainerColor
              // console.log('relatedParticipant', relatedParticipant)
              if (relatedParticipant) {
                participantName = athletName(relatedParticipant.athlet)
                participantTrainerName = trainerName(relatedParticipant.trainer)
                trainerColor = relatedParticipant.trainer.color
              } else {
                participantName = ''
                participantTrainerName = ''
                trainerColor = 'white'
              }
              return (
                <tr key={`participant-${participantIndex}`}>
                  <td>
                    <div title='trainer name' style={styles0.coloredTrainer(trainerColor)}></div>
                    <div style={{ display: 'inline-block' }}>
                      <input
                        type='text'
                        placeholder='участник'
                        onChange={onParticipantAddedToGroup(participantIndex)}
                        className={classes.athletInput}
                        value={participantName}
                      />
                      <div className={classes.trainer}>{participantTrainerName}</div>
                    </div>
                  </td>
                  <td className={classes.number}>0</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Box>
    </div>
  )
}

const styles = {
  levelBox: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
    justifyContent: 'center'
  },
  groupTable: {
    width: 250,
    border: '1px solid gray',
    borderRadius: 5
  },
  number: { width: 10, padding: 5, color: 'slategray' },
  athletInput: { width: '100%', border: 'none' },
  trainer: { color: 'gray', fontSize: 10 }
}

const mapDispatchToProps = dispatch => ({
  setGroupParticipant: payload => dispatch(setGroupParticipant(payload))
})

export default compose(
  withStyles(styles),
  connect(
    null,
    mapDispatchToProps
  )
)(GroupTable)
