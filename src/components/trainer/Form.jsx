import React, { useState, useEffect } from 'react'
import nanoid from 'nanoid'
import { useFirestore } from 'react-redux-firebase'
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
  const { isModalOpen, data, closeModal, collection, doc } = props
  const firestore = useFirestore()
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
    //id is empty when we creates new entry, and id is filled when we edit an existent one
    const id = formState.id ? formState.id : nanoid(10)
    firestore.set({ collection, doc }, { [id]: formState }, { merge: true }).catch(error => {
      console.log('firestoreSet error', error.message)
    })
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
