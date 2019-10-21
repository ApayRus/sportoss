import React, { useState } from 'react'
import { Fab, CircularProgress } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import Table from '../layouts/table/Table'
import Form from './Form'

import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import { categoryName } from '../../config/functions'

//Table columns or fields of our data model
const columns = [{ id: 'categoryName', numeric: false, disablePadding: false, label: 'Категория' }]

function Page(props) {
  const { categories } = props

  const [isModalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState({ gender: '', minAge: '', maxAge: '', weight: '' })

  const openModal = id => {
    const modalData = categories.find(el => el.id === id)
    setModalData(modalData)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }
  let tableData = []
  if (isLoaded(categories)) {
    tableData = categories.map(cat => {
      return { id: cat.id, categoryName: categoryName(cat) }
    })
  }

  const { add: firestoreAdd, delete: firestoreDelete, update: firestoreUpdate } = props.firestore

  return (
    <main>
      {isLoaded(categories) ? (
        <Table
          data={tableData}
          // handleSelected={this.getSelected}
          openModal={openModal}
          firestoreDelete={firestoreDelete}
          columns={columns}
          collection='categories'
          title='Категории'
        />
      ) : (
        <CircularProgress />
      )}
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
        />
      )}
    </main>
  )
}

const mapStateToProps = state => {
  return {
    categories: state.firestore.ordered.categories
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: 'categories' }])
)(Page)

const fabStyle = {
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed'
}
