import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import CopyIcon from '@material-ui/icons/FileCopy'
import EditIcon from '@material-ui/icons/Edit'

import FilterListIcon from '@material-ui/icons/FilterList'
import { lighten } from '@material-ui/core/styles/colorManipulator'

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

const EnhancedTableToolbar = props => {
  const { numSelected, showToolbarButtons } = props
  console.log('showToolbarButtons', showToolbarButtons)
  const classes = useStyles()

  const handleDelete = () => {
    const { firestoreDelete, selected, collection } = props
    selected.forEach(doc => {
      firestoreDelete({ collection, doc })
    })
  }

  const handleEdit = () => {
    const { openModal, selected } = props
    openModal(selected[selected.length - 1])
  }

  const handleClone = () => {}

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
