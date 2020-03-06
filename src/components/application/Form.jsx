import React, { useState, useEffect } from 'react'

import {
  Button,
  Typography,
  FormHelperText,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'
import { tournamentName } from '../../config/functions'
import AthletTable from '../layouts/table/Table'
import Select from './FormSelect'
import athletsWithCategoriesTrainers from './FormAthlets'
import { useFirestore } from 'react-redux-firebase'
import { useSelector } from 'react-redux'

const columns = [
  { id: 'participant', numeric: false, disablePadding: false, label: 'Участник' },
  { id: 'category', numeric: false, disablePadding: false, label: 'Категория' },
  { id: 'trainer', numeric: false, disablePadding: false, label: 'Тренер' }
]

function Form(props) {
  const { data, isModalOpen, closeModal } = props
  const { profile } = useSelector(state => state.firebase)
  const { athlets, categories, tournaments, trainers, fromUserId } = useSelector(
    state => state.pageContent
  )
  const { userId, userName } = profile
  const [formState, setFormState] = useState({ tournamentId: '', participants: {} })
  const [selected, setSelected] = useState([])
  const firestore = useFirestore()
  useEffect(() => {
    //component will mount
    // console.log('setFormState(data)', data)
    setFormState(data)
    const selected = Object.keys(data.participants)
    setSelected(selected)
    return () => {
      //component will UNmount
    }
  }, [])

  const handleSubmit = () => {
    //only selected participants should enter into the app
    const participants = { ...formState.participants }
    Object.keys(participants).forEach(key => {
      if (!selected.includes(key)) {
        delete participants[key]
      }
    })

    const newFormState = { ...formState, participants }
    //id is empty when we creates new endtry, and filled when we edit an existen one
    if (!formState.id) {
      const created = { userId, userName, time: Date.now() }
      firestore
        .add({ collection: 'applications' }, { ...newFormState, created, fromUserId })
        .catch(error => {
          console.log('firestoreAdd error', error)
        })
    } else {
      const updated = { userId, userName, time: Date.now() }
      firestore
        .set(
          { collection: 'applications', doc: formState.id },
          { ...newFormState, updated, fromUserId }
        )
        .catch(error => {
          console.log('firestoreUpdate error', error)
        })
    }

    handleCancel()
  }

  const handleCancel = () => {
    closeModal()
  }

  const formTitle = formState.id ? 'Редактирование' : 'Добавление'

  const handleChangeTournament = e => {
    setFormState({ ...formState, tournamentId: e.target.value })
  }

  const handleChangeCategory = athletId => event => {
    //participants = { athletId: {categoryId, trainerId} }
    // const athletId = event.target.dataset.id
    const categoryId = event.target.value
    const participants = { ...formState.participants }
    participants[athletId] = { ...participants[athletId], categoryId, athletId }
    setFormState({ ...formState, participants })
  }

  const handleChangeTrainer = athletId => event => {
    // const athletId = event.target.dataset.id
    const trainerId = event.target.value
    const participants = { ...formState.participants }
    participants[athletId] = { ...participants[athletId], trainerId, athletId }
    setFormState({ ...formState, participants })
  }

  const handleSelect = selected => {
    setSelected(selected)
  }

  const tournamentValue = formState.tournamentId || ''

  const TournamentSelect = (
    <Select
      value={tournamentValue}
      options={tournaments}
      handleChange={handleChangeTournament}
      nameFunction={tournamentName}
    />
  )

  const athletsForTable = athletsWithCategoriesTrainers(
    athlets,
    categories,
    tournaments,
    trainers,
    formState.tournamentId,
    formState.participants,
    handleChangeCategory,
    handleChangeTrainer
  )

  return (
    <Dialog
      maxWidth={false}
      open={isModalOpen}
      onClose={closeModal}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>
        <Typography color='primary'>{formTitle} заявки</Typography>
      </DialogTitle>
      <DialogContent>
        <form>
          <FormControl fullWidth>
            <InputLabel htmlFor='tournamentId'>Турнир</InputLabel>
            {TournamentSelect}
          </FormControl>

          <AthletTable
            data={athletsForTable}
            // openModal={this.openModal}
            columns={columns}
            title='Участники'
            hideToolbar={true}
            disableRowClick
            selected={selected}
            handleSelect={handleSelect}
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
