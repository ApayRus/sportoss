import React, { useState } from 'react'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Table from '../layouts/table/Table'
import Form from './Form'
//Table columns or fields of our data model
const columnsAthlets = [
  { id: 'name', numeric: false, disablePadding: false, label: 'ФИО' },
  { id: 'birthday', numeric: false, disablePadding: false, label: 'Родился' },
  { id: 'gender', numeric: false, disablePadding: false, label: 'Пол' },
  { id: 'createdBy', numeric: false, disablePadding: false, label: 'Добавил' },
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
  },
  athletsContainer: {
    position: 'relative'
  }
}

export function Page(props) {
  const [isModalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState({})
  const { athlets, userId, userName, firestoreAdd, firestoreUpdate, firestoreDelete } = props

  const openModal = id => {
    const defaultFormData = {
      familyName: '',
      firstName: '',
      fatherName: '',
      birthday: '',
      gender: ''
    } // if we create new entry
    const modalData = athlets.find(el => el.id === id) || defaultFormData
    setModalData(modalData)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const tableData = athlets.map(athlet => {
    return {
      ...athlet,
      name: `${athlet.familyName} ${athlet.firstName} ${athlet.fatherName}`,
      createdBy: athlet.createdBy.userName
    }
  })

  return (
    <div>
      <Table
        data={tableData}
        openModal={openModal}
        firestoreDelete={firestoreDelete} showToolbarButtons={{ edit: true, clone:true }}
        columns={columnsAthlets}
        collection='athlets'
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
          firestoreAdd={firestoreAdd}
          firestoreUpdate={firestoreUpdate}
          userId={userId}
          userName={userName}
        />
      )}
    </div>
  )
}

export default Page
