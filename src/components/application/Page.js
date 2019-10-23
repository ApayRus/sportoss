import React, { useState } from 'react'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Table from '../layouts/table/Table'
import Form from './Form'
import { tournamentName } from '../../config/functions'
//Table columns or fields of our data model
const columns = [{ id: 'name', numeric: false, disablePadding: false, label: 'Турнир' }]

const styles = {
  fab: {
    margin: 0,
    top: 'auto',
    right: 5,
    bottom: 5,
    left: 'auto',
    position: 'fixed'
  }
}

export function Page(props) {
  const [isModalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState({})
  const {
    athlets,
    applications,
    categories,
    tournaments,
    trainers,
    userId,
    userName,
    firestoreAdd,
    firestoreUpdate,
    firestoreDelete
  } = props

  const openModal = id => {
    const defaultFormData = {
      tournamentId: '',
      participants: {}
    } // if we create new entry
    const modalData = applications.find(el => el.id === id) || defaultFormData
    setModalData(modalData)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const tableData = applications.map(app => {
    const tournament = tournaments.filter(elem => elem.id === app.tournamentId)[0]
    if (tournament) return { ...app, name: tournamentName(tournament) }
    else return { ...app, name: '' }
  })

  const modalFormProps = {
    athlets,
    applications,
    categories,
    tournaments,
    trainers,
    isModalOpen,
    closeModal,
    firestoreAdd,
    firestoreUpdate,
    userId,
    userName
  }

  return (
    <div>
      <Table
        data={tableData}
        openModal={openModal}
        firestoreDelete={firestoreDelete}
        columns={columns}
        collection='applications'
        title='Заявки'
      />

      <Fab style={styles.fab} onClick={() => openModal(null)} color='primary' aria-label='Add'>
        <AddIcon />
      </Fab>
      {isModalOpen && <Form data={modalData} {...modalFormProps} />}
    </div>
  )
}

export default Page
