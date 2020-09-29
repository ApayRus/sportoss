import React from 'react'
import Form from './Form'
import View from './View'

function Page(props) {
	return (
		<div>
			<Form {...props} />
			<View {...props} />
		</div>
	)
}

export default Page
