import React from 'react'
import {
	TableHead,
	TableCell,
	TableRow,
	TableSortLabel,
	Checkbox,
	Tooltip
} from '@material-ui/core'

const TableHeadComponent = props => {
	const createSortHandler = property => event => {
		props.onRequestSort(event, property)
	}

	const { columns, onSelectAllClick, order, orderBy, numSelected, rowCount, hideCheckboxes } = props
	return (
		<TableHead>
			<TableRow>
				{!hideCheckboxes && (
					<TableCell padding='checkbox'>
						{rowCount > 0 && (
							<Checkbox
								indeterminate={numSelected > 0 && numSelected < rowCount}
								checked={numSelected === rowCount}
								onChange={onSelectAllClick}
							/>
						)}
					</TableCell>
				)}
				{columns.map(col => (
					<TableCell
						key={col.id}
						align={col.numeric ? 'right' : 'left'}
						padding={col.disablePadding ? 'none' : 'default'}
						sortDirection={orderBy === col.id ? order : false}
					>
						<Tooltip
							title='Sort'
							placement={col.numeric ? 'bottom-end' : 'bottom-start'}
							enterDelay={300}
						>
							<TableSortLabel
								active={orderBy === col.id}
								direction={order}
								onClick={createSortHandler(col.id)}
							>
								{col.label}
							</TableSortLabel>
						</Tooltip>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	)
}

export default TableHeadComponent
