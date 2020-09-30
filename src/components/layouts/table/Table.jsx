import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { Table, TableBody, TableCell, TableRow, Paper, Checkbox } from '@material-ui/core'

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

const useStyles = makeStyles(theme => ({
	root: {
		margin: theme.spacing(3)
	},
	/*   table: {
    minWidth: 1020
  }, */
	tableWrapper: {
		overflowX: 'auto'
	}
}))

const TableComponent = props => {
	const [state, setState] = useState({
		order: 'asc',
		orderBy: 'name',
		selected: props.selected || []
	})

	const classes = useStyles()

	const handleRequestSort = (event, property) => {
		const orderBy = property
		let order = 'desc'

		if (state.orderBy === property && state.order === 'desc') {
			order = 'asc'
		}

		setState({ ...state, order, orderBy })
	}

	const handleSelectAllClick = event => {
		const data = props.data
		let selected = []

		if (event.target.checked) {
			selected = data.map(n => n.id)
		}

		setState({ ...state, selected })

		if (props.handleSelect) props.handleSelect(selected)
	}

	const handleClick = (event, id) => {
		const { selected } = state
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
		if (props.handleSelect) {
			props.handleSelect(newSelected)
		}
		setState({ ...state, selected: newSelected })
	}

	const setSelection = selected => {
		setState({ ...state, selected })
	}

	const isSelected = id => state.selected.indexOf(id) !== -1

	const { columns, hideToolbar, hideCheckboxes, disableRowClick } = props
	const { order, orderBy, selected } = state
	const { data = [] } = props
	return (
		<Paper className={classes.root}>
			{!hideToolbar && (
				<EnhancedTableToolbar
					numSelected={selected.length}
					selected={selected}
					setSelection={setSelection}
					collection={props.collection}
					doc={props.doc}
					openModal={props.openModal}
					showToolbarButtons={props.showToolbarButtons}
					title={props.title}
				/>
			)}
			<div className={classes.tableWrapper}>
				<Table className={classes.table} aria-labelledby='tableTitle'>
					<EnhancedTableHead
						columns={columns}
						numSelected={selected.length}
						order={order}
						orderBy={orderBy}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data.length}
						hideCheckboxes={hideCheckboxes}
					/>
					<TableBody>
						{stableSort(data, getSorting(order, orderBy)).map(row => {
							const isSelectedRow = isSelected(row.id)
							return (
								<TableRow
									hover
									onClick={
										!(hideCheckboxes || disableRowClick)
											? event => handleClick(event, row.id)
											: null
									}
									role='checkbox'
									aria-checked={isSelectedRow}
									tabIndex={-1}
									key={row.id}
									selected={isSelectedRow}
								>
									{!hideCheckboxes && (
										<TableCell padding='checkbox'>
											<Checkbox
												checked={isSelectedRow}
												onClick={disableRowClick ? event => handleClick(event, row.id) : null}
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

export default TableComponent
