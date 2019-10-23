import React from 'react'
import PropTypes from 'prop-types'
import SelectMUI from '@material-ui/core/Select'

/**
 * Gets array of data and makes from it Select
 * @parentId {parentId} props
 * @value {value} props
 * @handleChange {handleChange} props
 * @nameFunction {nameFunction} props
 * @data {data} props
 *
 */
function Select(props) {
  const { value, handleChange, nameFunction, data } = props
  return (
    <SelectMUI native style={{ fontSize: '0.8125rem' }} onChange={handleChange} value={value}>
      <option value='' />
      {data
        ? data.map(elem => (
            <option value={elem.id} key={elem.id}>
              {nameFunction(elem)}
            </option>
          ))
        : '...'}
    </SelectMUI>
  )
}

Select.propTypes = {
  parentId: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  nameFunction: PropTypes.func,
  data: PropTypes.array
}

export default Select
