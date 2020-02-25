import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import CopyIcon from '@material-ui/icons/FileCopy'
import EditIcon from '@material-ui/icons/Edit'
import { useFirestore } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import nanoid from 'nanoid'
import FilterListIcon from '@material-ui/icons/FilterList'

/**
 * Table toolbar contain a custom set of actions: Delete, Clone, Edit
 * There is 2 main editMode for Table: doc and collection
 * table can represent:
 *  1) whole collection (row = doc)
 *  2) a single document (row = 1 key from object/map)
 *  depending on this, cloning and deletion will be different,
 *  and before we do this operations, we check editMode (doc or collection)
 */

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing(),
    position: 'sticky',
    top: 0,
    zIndex: 2,
    backgroundColor: 'white'
  },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: '0 0 auto'
  }
})

const useStyles = makeStyles(toolbarStyles)

function EnhancedTableToolbar(props) {
  const { numSelected, showToolbarButtons, editMode } = props
  const classes = useStyles()
  const { openModal, selected = [], collection } = props
  const { profile } = useSelector(state => state.firebase)
  const lastSelectedId = selected[selected.length - 1]
  const collectionData = useSelector(state => state.firestore.data[collection])
  const forClone = collectionData ? collectionData[lastSelectedId] : {}
  const firestore = useFirestore()

  const handleDelete = () => {
    if (editMode === 'doc') {
      selected.forEach(id => {
        const deleted = collectionData[id]['deleted'] ? false : true
        firestore.set({ collection, doc: profile.club }, { [id]: { deleted } }, { merge: true })
      })
    } else {
      selected.forEach(doc => {
        firestore.delete({ collection, doc })
      })
    }
  }

  const handleEdit = () => {
    openModal(lastSelectedId)
  }

  const handleClone = () => {
    if (editMode === 'doc') {
      const id = nanoid(10)
      firestore
        .set({ collection, doc: profile.club }, { [id]: forClone }, { merge: true })
        .then(ref => {
          props.setSelection([id])
        })
    } else {
      console.log('editMode', editMode)
      firestore
        .collection(collection)
        .add(forClone)
        .then(ref => {
          props.setSelection([ref.id])
        })
    }
  }

  const { title } = props

  const toolBarButton = (title, onClick, icon) => (
    <Tooltip style={{ display: 'inline' }} title={title} onClick={onClick}>
      <IconButton aria-label={title}>{icon}</IconButton>
    </Tooltip>
  )

  return (
    <Toolbar className={classes.root}>
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color='inherit' variant='subtitle1'>
            {numSelected} выбрано
          </Typography>
        ) : (
          <Typography variant='h6' id='tableTitle'>
            {title}
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <div style={{ width: 144, textAlign: 'right' }}>
            {showToolbarButtons.delete && toolBarButton('Удалить', handleDelete, <DeleteIcon />)}
            {showToolbarButtons.clone && toolBarButton('Клонировать', handleClone, <CopyIcon />)}
            {showToolbarButtons.edit && toolBarButton('Редактировать', handleEdit, <EditIcon />)}
          </div>
        ) : (
          <Tooltip title='Filter list'>
            <IconButton aria-label='Filter list'>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  )
}

export default EnhancedTableToolbar
