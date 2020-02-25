import React, { useState } from 'react'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DeletedIcon from '@material-ui/icons/Close'
import Table from '../layouts/table/Table'
import Form from './Form'
import { categoryName } from '../../config/functions'

//Table columns or fields of our data model
const columns = [
  { id: 'categoryName', numeric: false, disablePadding: false, label: 'Категория' },
  { id: 'id', numeric: false, disablePadding: false, label: 'id' }
]

const fabStyle = {
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed'
}

function Page(props) {
  const { categories, firestoreSet, club } = props
  const [isModalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState({})

  const openModal = id => {
    const defaultFormData = { gender: '', minAge: '', maxAge: '', weight: '' }
    const modalData = categories.find(el => el.id === id) || defaultFormData
    setModalData(modalData)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const tableData = categories.map(cat => {
    const isDeleted = cat.deleted ? '(x) ' : ''
    return {
      id: cat.id,
      categoryName: isDeleted + categoryName(cat)
    }
  })

  return (
    <main>
      <Table
        data={tableData}
        openModal={openModal}
        showToolbarButtons={{ edit: true, delete: true, clone: true }}
        editMode='doc'
        columns={columns}
        collection='categories'
        title='Категории'
      />
      <Fab style={fabStyle} onClick={() => openModal(null)} color='primary' aria-label='Add'>
        <AddIcon />
      </Fab>
      {isModalOpen && (
        <Form
          isModalOpen={isModalOpen}
          data={modalData}
          closeModal={closeModal}
          firestoreSet={firestoreSet}
          club={club}
        />
      )}
    </main>
  )
}

export default Page
