import React, { useState } from 'react'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Table from '../layouts/table/Table'
import Form from './Form'
//Table columns or fields of our data model
const columnsTrainers = [
  { id: 'name', numeric: false, disablePadding: false, label: 'ФИО' },
  { id: 'id', numeric: false, disablePadding: false, label: 'id' }
]

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
  const { trainers, profile } = props

  const openModal = id => {
    const defaultFormData = {
      familyName: '',
      firstName: '',
      fatherName: ''
    } // if we create new entry
    const modalData = trainers.find(el => el.id === id) || defaultFormData
    setModalData(modalData)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const tableData = trainers.map(trainer => {
    const isDeleted = trainer.deleted ? '(x) ' : ''
    return {
      ...trainer,
      name: `${isDeleted} ${trainer.familyName} ${trainer.firstName} ${trainer.fatherName}`
    }
  })

  return (
    <div>
      <Table
        data={tableData}
        openModal={openModal}
        showToolbarButtons={{ edit: true, clone: true, delete: true }}
        columns={columnsTrainers}
        collection='trainers'
        doc={profile.club}
        title='Спортсмены'
      />

      <Fab style={styles.fab} onClick={() => openModal(null)} color='primary' aria-label='Add'>
        <AddIcon />
      </Fab>
      {isModalOpen && (
        <Form
          isModalOpen={isModalOpen}
          data={modalData}
          closeModal={closeModal}
          collection='trainers'
          doc={profile.club}
        />
      )}
    </div>
  )
}

export default Page
