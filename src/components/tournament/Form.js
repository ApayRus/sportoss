import React from 'react'

import {
  Button,
  TextField,
  Typography,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress
} from '@material-ui/core'
// import { Link, Redirect } from "react-router-dom";
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import CategoryTable from '../table/Table'
import { categoryName } from '../../config/functions'

const categoryColumns = [{ id: 'name', numeric: false, disablePadding: true, label: 'Категории' }]

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = { id: '', name: '', date: '', dateAge: '', address: '', categories: [] }
  }

  componentDidMount() {
    const { id, name, date, dateAge, address, categories } = this.props.data
    if (id) this.setState({ id, name, date, dateAge, address, categories })
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSelect = selected => {
    this.setState({ categories: selected })
  }

  handleSubmit = () => {
    const { id, name, date, dateAge, address, categories } = this.state
    const createdBy = {
      userName: this.props.profile.username,
      userId: this.props.auth.uid
    }
    //id is empty when we creates new endtry, and filled when we edit an existen one
    if (!id) {
      const firestoreAdd = this.props.firestoreAdd(
        { collection: 'tournaments' },
        { name, date, dateAge, address, categories, createdBy }
      )
      firestoreAdd.catch(error => {
        console.log('firestoreAdd error', error.message)
      })
    } else {
      console.log('update categories', categories)
      const firestoreUpdate = this.props
        .firestoreUpdate(
          { collection: 'tournaments', doc: id },
          { id, name, date, dateAge, address, categories, createdBy }
        )
        .then(result => console.log('result', result))
      firestoreUpdate.catch(error => {
        console.log('firestoreUpdate error', error.message)
      })
    }

    this.handleCancel()
  }

  handleCancel = () => {
    this.props.closeModal()
  }

  render() {
    const { id, name, date, dateAge, address, categories } = this.state
    const { allCategories } = this.props
    const allCategoryNames = allCategories.map(cat => {
      return { id: cat.id, name: categoryName(cat) }
    })
    const formTitle = id ? 'Редактирование' : 'Добавление'
    // console.log("categories", categories);

    return (
      <Dialog
        open={this.props.isModalOpen}
        onClose={this.handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          <Typography color='primary'>{formTitle} турнира</Typography>
        </DialogTitle>
        <DialogContent>
          <form onChange={this.handleChange}>
            {/* NAME */}
            <TextField
              id='name'
              label='Название'
              type='text'
              value={name}
              margin='normal'
              autoFocus
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            <br />
            {/* DATE */}
            <TextField
              id='date'
              label='Дата соревнования'
              type='date'
              value={date}
              margin='normal'
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            {/* DATE */}
            <TextField
              id='dateAge'
              label='Дата определения возраста'
              type='date'
              value={dateAge}
              margin='normal'
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            {/* ADDRESS */}
            <TextField
              id='address'
              label='Адрес'
              type='text'
              value={address}
              margin='normal'
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            {isLoaded(categories) ? (
              <CategoryTable
                data={allCategoryNames}
                openModal={this.openModal}
                columns={categoryColumns}
                collection='categories'
                title='Категории'
                selected={this.state.categories}
                handleSelect={this.handleSelect}
                hideToolbar={true}
              />
            ) : (
              <CircularProgress />
            )}
          </form>
          <br />
          <FormHelperText> {/*THIS IS PLACE FOR ERROR MESSAGE */}</FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color='primary'>
            Cancel
          </Button>
          <Button onClick={this.handleSubmit} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    allCategories: state.firestore.ordered.categories
  }
}

export default compose(
  firestoreConnect(props => {
    return [{ collection: 'tournaments', storeAs: 'tournaments' }]
  }),
  connect(mapStateToProps)
)(Form)
