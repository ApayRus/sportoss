import React from 'react'
import { athletName, trainerName } from '../../config/functions'
import { Typography } from '@material-ui/core'

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

function Participants(props) {
  const { participants, trainerColorMap, participantsToHide } = props

  return (
    <div style={styles.flexColumn}>
      {participants.map(elem => {
        const trainerColor = trainerColorMap[elem.trainer.id]

        return (
          <div
            key={`participant-${elem.athlet.id}`}
            style={{
              whiteSpace: 'nowrap',
              visibility: participantsToHide.has(elem.athlet.id) ? 'hidden' : 'visible'
            }}
          >
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
  )
}

export default Participants
