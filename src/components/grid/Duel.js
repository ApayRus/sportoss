import React from 'react';
import PropTypes from 'prop-types'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

function RadioButtonsGroup(props) {
  const [value, setValue] = React.useState('');

  function handleChange(event) {
    setValue(event.target.value);
  }

  const {participant1, participant2} = props

  return (
    <div >
      <FormControl component="fieldset" >
        <RadioGroup
          aria-label="gender"
          name="gender2"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            value={participant1.id}
            control={<Radio color="primary" />}
            label={participant1}
            labelPlacement="start"
          />
          <FormControlLabel
            value={participant2.id}
            control={<Radio color="primary" />}
            label={participant2}
            labelPlacement="start"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}

RadioButtonsGroup.propTypes = {
    participant1: PropTypes.element, 
    participant2: PropTypes.element
    }

export default RadioButtonsGroup;