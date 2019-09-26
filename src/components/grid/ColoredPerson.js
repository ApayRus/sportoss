import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'

function ColoredPerson(props) {
  const { color, name } = props

  const style = {
    border: '1px dashed gray',
    padding: '0.2rem 0.2rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    width: '15rem'
  }

  const colorBoxStyle = {
    backgroundColor: color,
    width: '1rem',
    height: '1rem',
    display: 'inline-block',
    marginRight: '0.75rem'
    /* cursor: 'move', */
  }

  return (
    <div>
      <div style={style}>
        <div style={colorBoxStyle} />
        <Typography variant='caption' inline>
          {name}
        </Typography>
      </div>
    </div>
  )
}

ColoredPerson.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string
}

export default ColoredPerson
