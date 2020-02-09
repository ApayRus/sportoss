import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import EnhancedTableToolbar from './TableToolbar'
import EnhancedTableHead from './TableHead'

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}

const styles = theme => ({
  root: {
    margin: theme.spacing(3)
  },
  /*   table: {
    minWidth: 1020
  }, */
  tableWrapper: {
    overflowX: 'auto'
  }
})

class EnhancedTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'name',
    selected: this.props.selected || []
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  }

  handleSelectAllClick = event => {
    const data = this.props.data
    let selected = []

    if (event.target.checked) {
      selected = data.map(n => n.id)
    }

    this.setState({ selected })

    if (this.props.handleSelect) this.props.handleSelect(selected)
  }

  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    //console.log("newSelected", newSelected);
    if (this.props.handleSelect) {
      this.props.handleSelect(newSelected)
    }
    this.setState({ selected: newSelected })
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  render() {
    const { classes, columns, hideToolbar, hideCheckboxes, disableRowClick } = this.props
    const { order, orderBy, selected } = this.state
    const data = this.props.data || []
    return (
      <Paper className={classes.root}>
        {!hideToolbar && (
          <EnhancedTableToolbar
            numSelected={selected.length}
            selected={selected}
            firestoreDelete={this.props.firestoreDelete}
            collection={this.props.collection}
            openModal={this.props.openModal}
            showToolbarButtons={this.props.showToolbarButtons}
            title={this.props.title}
          />
        )}
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby='tableTitle'>
            <EnhancedTableHead
              columns={columns}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              hideCheckboxes={hideCheckboxes}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy)).map(row => {
                const isSelected = this.isSelected(row.id)
                return (
                  <TableRow
                    hover
                    onClick={
                      !(hideCheckboxes || disableRowClick)
                        ? event => this.handleClick(event, row.id)
                        : null
                    }
                    role='checkbox'
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isSelected}
                  >
                    {!hideCheckboxes && (
                      <TableCell padding='checkbox'>
                        <Checkbox
                          checked={isSelected}
                          onClick={
                            disableRowClick ? event => this.handleClick(event, row.id) : null
                          }
                        />
                      </TableCell>
                    )}
                    {columns.map((col, index) => (
                      <TableCell align='left' key={`${row.id}-${col.id}-${index}`}>
                        {row[col.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Paper>
    )
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(EnhancedTable)
