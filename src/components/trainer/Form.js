import React, { useState, useEffect } from 'react'

import {
  Button,
  TextField,
  Typography,
  FormHelperText,
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
    const createdBy = { userId, userName }
    //id is empty when we creates new endtry, and filled when we edit an existen one
    if (!formState.id) {
      firestoreAdd({ collection: 'trainers' }, { ...formState, createdBy }).catch(error => {
        console.log('firestoreAdd error', error)
      })
    } else {
      firestoreUpdate(
        { collection: 'trainers', doc: formState.id },
        { ...formState, createdBy }
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
          <Typography color='primary'>{formTitle} тренера</Typography>
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
              id='firstName'
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
              id='fatherName'
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
