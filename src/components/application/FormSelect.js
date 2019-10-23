import React from 'react'
import SelectMUI from '@material-ui/core/Select'

function Select(props) {
  const { value, handleChange, nameFunction, options } = props
  return (
    <SelectMUI native style={{ fontSize: '0.8125rem' }} onChange={handleChange} value={value}>
      <option value='' />
      {options
        ? options.map(elem => (
            <option value={elem.id} key={elem.id}>
              {nameFunction(elem)}
            </option>
          ))
        : '...'}
    </SelectMUI>
  )
}

export default Select
