import React from 'react'
import { Chip } from '@material-ui/core'

function RoleChecker({ onRoleClick = () => {}, roles = {}, size = 'medium' }) {
	const roleKeys = Object.keys(roles)
	return (
		<div>
			{roleKeys.map(roleName => (
				<Chip
					size={size}
					onClick={onRoleClick(roleName)}
					style={{ marginRight: 5 }}
					key={`chip-${roleName}`}
					label={roleName}
					color={roles[roleName] ? 'primary' : 'default'}
				/>
			))}
		</div>
	)
}

export default RoleChecker
