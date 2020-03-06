import React, { useState } from 'react'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Table from '../layouts/table/Table'
import Form from './Form'
import { tournamentName } from '../../config/functions'
import { useSelector } from 'react-redux'

//Table columns or fields of our data model
const columns = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Турнир' },
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
  const { applications, tournaments } = useSelector(state => state.pageContent)
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
    isModalOpen,
    closeModal,
    collection: 'applications'
  }

  return (
    <div>
      <Table
        data={tableData}
        openModal={openModal}
        showToolbarButtons={{ edit: true, clone: true }}
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
