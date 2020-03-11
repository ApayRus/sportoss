import React, { useState } from 'react'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Table from '../layouts/table/Table'
import Form from './Form'
import { useSelector } from 'react-redux'

//Table columns or fields of our data model
const columnsAthlets = [
  { id: 'name', numeric: false, disablePadding: false, label: 'ФИО' },
  { id: 'birthday', numeric: false, disablePadding: false, label: 'Родился' },
  { id: 'gender', numeric: false, disablePadding: false, label: 'Пол' },
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
  const { athlets, fromUserId } = useSelector(state => state.pageContent)
  const [isModalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState({})

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
    const isDeleted = athlet.deleted ? '(x) ' : ''
    return {
      ...athlet,
      name: isDeleted + `${athlet.familyName} ${athlet.firstName} ${athlet.fatherName}`
    }
  })

  return (
    <div>
      <Table
        data={tableData}
        openModal={openModal}
        showToolbarButtons={{ edit: true, clone: true }}
        columns={columnsAthlets}
        collection='athletes'
        doc={fromUserId}
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
          collection='athletes'
          doc={fromUserId}
        />
      )}
    </div>
  )
}

export default Page
