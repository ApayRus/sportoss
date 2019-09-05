import React, { Component } from 'react'
import { Fab, CircularProgress } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import Table from '../table/Table'
import Form from './Form'

import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import { categoryName } from '../../config/functions'

//Table columns or fields of our data model
const columns = [{ id: 'categoryName', numeric: false, disablePadding: false, label: 'Категория' }]

export class Page extends Component {
  state = { isModalOpen: false, data: {} }

  openModal = id => {
    const defaultData = { gender: '', minAge: '', maxAge: '', weight: '' } // if we create new entry
    const modalData = this.props.categories.find(el => el.id === id) || defaultData
    this.setState({ modalData })
    this.setState({ isModalOpen: true })
  }

  closeModal = () => {
    this.setState({ isModalOpen: false })
  }

  render() {
    let { categories } = this.props

    if (isLoaded(categories)) {
      categories = categories.map(cat => {
        return { id: cat.id, categoryName: categoryName(cat) }
      })
    }
    const {
      add: firestoreAdd,
      delete: firestoreDelete,
      update: firestoreUpdate
    } = this.props.firestore

    return (
      <main>
        {isLoaded(categories) ? (
          <Table
            data={categories}
            // handleSelected={this.getSelected}
            openModal={this.openModal}
            firestoreDelete={firestoreDelete}
            columns={columns}
            collection='categories'
            title='Категории'
          />
        ) : (
          <CircularProgress />
        )}
        <Fab style={fabStyle} onClick={() => this.openModal(null)} color='primary' aria-label='Add'>
          <AddIcon />
        </Fab>
        {this.state.isModalOpen && (
          <Form
            isModalOpen={this.state.isModalOpen}
            data={this.state.modalData}
            closeModal={this.closeModal}
            firestoreAdd={firestoreAdd}
            firestoreUpdate={firestoreUpdate}
          />
        )}
      </main>
    )
  }
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
