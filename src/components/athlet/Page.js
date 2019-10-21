import React, { useState } from 'react'
import { Fab, CircularProgress } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Table from '../layouts/table/Table'
import Form from './Form'
import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
//Table columns or fields of our data model
const columnsAthlets = [
  { id: 'name', numeric: false, disablePadding: false, label: 'ФИО' },
  { id: 'birthday', numeric: false, disablePadding: false, label: 'Родился' },
  { id: 'gender', numeric: false, disablePadding: false, label: 'Пол' }
]

export function Page(props) {
  const [isModalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState({})
  const [selected, setSelected] = useState(false)

  const { athlets, userId, userName } = props
  const { add: firestoreAdd, update: firestoreUpdate, delete: firestoreDelete } = props.firestore

  const openModal = id => {
    const defaultData = { name: '', birthday: '', gender: '' } // if we create new entry
    const modalData = athlets.find(el => el.id === id) || defaultData
    setModalData(modalData)
    setModalOpen(true)
  }

  const handleSelect = selected => {
    setSelected(selected)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  let tableData = []
  if (isLoaded(athlets)) {
    tableData = athlets.map(athlet => {
      return { ...athlet, name: `${athlet.familyName} ${athlet.firstName} ${athlet.fatherName}` }
    })
  }

  return (
    <main>
      {isLoaded(athlets) ? (
        <div>
          <Table
            data={tableData}
            openModal={openModal}
            firestoreDelete={firestoreDelete}
            columns={columnsAthlets}
            collection='athlets'
            title='Спортсмены'
            handleSelect={handleSelect}
            selected={selected}
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
      ) : (
        <CircularProgress />
      )}
    </main>
  )
}

const mapStateToProps = state => {
  return {
    athlets: state.firestore.ordered.athlets,
    userId: state.firebase.auth.uid,
    userName: state.firebase.profile.username
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    if (props.userId)
      return [{ collection: 'athlets', where: [['createdBy.userId', '==', props.userId]] }]
    else return []
  })
)(Page)

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
