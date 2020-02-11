import React, { useState, useEffect } from 'react'

import {
  Button,
  TextField,
  Typography,
  FormHelperText,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl
} from '@material-ui/core'
// import { Link, Redirect } from "react-router-dom";

const styles = {
  categoryInput: { width: 40, margin: 5 },
  categoryTypography: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 6,
    display: 'inline-block'
  },
  categoryContainer: {
    /* display: "flex", alignItems: "center" */
  }
}

function Form(props) {
  const { isModalOpen, data, closeModal, firestoreAdd, firestoreUpdate, userId, userName } = props

  const [formState, setFormState] = useState({})

  useEffect(() => {
    //component will mount
    setFormState(data)
    return () => {
      //component will UNmount
    }
  }, [])

  const handleChange = field => e => {
    setFormState({ ...formState, [field]: e.target.value.trim() })
  }

  const handleSubmit = () => {
    // category = { id, gender, minAge, maxAge, weight }
    const createdBy = {
      userName,
      userId
    }
    //id is empty when we creates new endtry, and filled when we edit an existen one
    if (!formState.id) {
      firestoreAdd({ collection: 'categories' }, { ...formState, createdBy }).catch(error => {
        console.log('firestoreAdd error', error.message)
      })
    } else {
      firestoreUpdate(
        { collection: 'categories', doc: formState.id },
        { ...formState, createdBy }
      ).catch(error => {
        console.log('firestoreUpdate error', error.message)
      })
    }

    handleCancel()
  }

  const handleCancel = () => {
    closeModal()
  }

  const formTitle = formState.id ? 'Редактирование' : 'Добавление'
  return (
    <Dialog open={isModalOpen} onClose={closeModal} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>
        <Typography color='primary'>{formTitle} категории</Typography>
      </DialogTitle>
      <DialogContent>
        <form style={styles.categoryContainer}>
          <Typography style={styles.categoryTypography}>Пол</Typography>
          <FormControl>
            <Select native value={formState.gender} onChange={handleChange('gender')}>
              <option value='' />
              <option value='Муж'>Муж</option>
              <option value='Жен'>Жен</option>
            </Select>
          </FormControl>
          <br />
          <Typography style={{ ...styles.categoryTypography, marginTop: 11 }}>Возраст</Typography>
          <TextField
            onChange={handleChange('minAge')}
            value={formState.minAge}
            placeholder='от'
            type='number'
            style={styles.categoryInput}
          />
          {` - `}
          <TextField
            placeholder='до'
            type='number'
            onChange={handleChange('maxAge')}
            value={formState.maxAge}
            style={styles.categoryInput}
          />
          <br />
          <Typography style={{ ...styles.categoryTypography, marginTop: 11 }}>Вес</Typography>
          <TextField
            placeholder='вес'
            type='text'
            onChange={handleChange('weight')}
            value={formState.weight}
            margin='normal'
            style={styles.categoryInput}
          />
        </form>
        <br />
        <FormHelperText> {/*THIS IS PLACE FOR ERROR MESSAGE */}</FormHelperText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color='primary'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Form
