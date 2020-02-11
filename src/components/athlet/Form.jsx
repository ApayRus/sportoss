import React, { useState, useEffect } from 'react'

import {
  Button,
  TextField,
  Typography,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'

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
    //id is empty when we creates new endtry, and filled when we edit an existen one
    if (!formState.id) {
      const createdBy = { userId, userName }
      firestoreAdd({ collection: 'athlets' }, { ...formState, createdBy }).catch(error => {
        console.log('firestoreAdd error', error)
      })
    } else {
      const updatedBy = { userId, userName }
      firestoreUpdate(
        { collection: 'athlets', doc: formState.id },
        { ...formState, updatedBy }
      ).catch(error => {
        console.log('firestoreUpdate error', error)
      })
    }

    handleCancel()
  }

  const handleCancel = () => {
    closeModal()
  }

  const formTitle = formState.id ? 'Редактирование' : 'Добавление'
  return (
    <div>
      <Dialog open={isModalOpen} onClose={closeModal} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>
          <Typography color='primary'>{formTitle} спортсмена</Typography>
        </DialogTitle>
        <DialogContent>
          <form>
            {/* FULLNAME */}
            <TextField
              onChange={handleChange('familyName')}
              label='Фамилия'
              type='text'
              value={formState.familyName}
              margin='normal'
              autoFocus
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              onChange={handleChange('firstName')}
              label='Имя'
              type='text'
              value={formState.firstName}
              margin='normal'
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              onChange={handleChange('fatherName')}
              label='Отчество'
              type='text'
              value={formState.fatherName}
              margin='normal'
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            <br />
            {/* BIRTHDAY */}
            <TextField
              onChange={handleChange('birthday')}
              label='Дата рождения'
              type='date'
              value={formState.birthday}
              margin='normal'
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            {/* GENDER */}
            <FormControl fullWidth>
              <InputLabel htmlFor='gender'>Пол</InputLabel>
              <Select
                native //if remove that, id does"t appear in event.target
                value={formState.gender}
                onChange={handleChange('gender')}
              >
                <option value='' />
                <option value='Муж'>Муж</option>
                <option value='Жен'>Жен</option>
              </Select>
            </FormControl>
          </form>
          <br />
          <FormHelperText> {/*THIS IS PLACE FOR ERROR MESSAGE */}</FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color='default'>
            Отмена
          </Button>
          <Button onClick={handleSubmit} color='primary'>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Form
