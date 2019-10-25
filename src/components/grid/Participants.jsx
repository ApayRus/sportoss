import React from 'react'
import { athletName, trainerName } from '../../config/functions'
import { Typography, Box } from '@material-ui/core'

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
  const { participants, participantsToHide } = props

  return (
    <div style={styles.flexColumn}>
      <Box displayPrint='none'>
        {participants.map(elem => {
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
                style={styles.coloredTrainer(elem.trainer.color)}
              ></div>
              <Typography variant='body1' style={{ display: 'inline-block' }}>
                {athletName(elem.athlet)}
              </Typography>
            </div>
          )
        })}
      </Box>
    </div>
  )
}

export default Participants
