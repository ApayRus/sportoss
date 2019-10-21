import React, { useState } from 'react'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import Table from '../layouts/table/Table'
import Form from './Form'
import { categoryName } from '../../config/functions'

//Table columns or fields of our data model
const columns = [{ id: 'categoryName', numeric: false, disablePadding: false, label: 'Категория' }]

function Page(props) {
  const { categories, userId, userName, firestoreAdd, firestoreUpdate, firestoreDelete } = props

  const [isModalOpen, setModalOpen] = useState(false)

  const defaultFormData = { gender: '', minAge: '', maxAge: '', weight: '' }
  const [modalData, setModalData] = useState(defaultFormData)

  const openModal = id => {
    const modalData = categories.find(el => el.id === id) || defaultFormData
    setModalData(modalData)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const tableData = categories.map(cat => ({ id: cat.id, categoryName: categoryName(cat) }))

  return (
    <main>
      <Table
        data={tableData}
        // handleSelected={this.getSelected}
        openModal={openModal}
        firestoreDelete={firestoreDelete}
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
          firestoreAdd={firestoreAdd}
          firestoreUpdate={firestoreUpdate}
          userId={userId}
          userName={userName}
        />
      )}
    </main>
  )
}

export default Page

const fabStyle = {
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed'
}
