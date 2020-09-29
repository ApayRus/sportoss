import React, { Component } from 'react'
import { Typography } from '@material-ui/core'
class App extends Component {
	render() {
		return (
			<div style={{ textAlign: 'center' }}>
				<Typography variant='body1'>Главная страница</Typography>
				{/* <img
					src='https://user-images.githubusercontent.com/1222611/93039496-54dfef80-f650-11ea-98fd-ca44e2358ab7.gif'
					alt='slideshow'
					style={{ width: '70%' }}
				/> */}
				{/* <iframe
					src='https://docs.google.com/presentation/d/e/2PACX-1vQHb8ipKu2cMsr3drFVUt4mPTdYzpfJmfBRq5rXoC-vbzZkeTf_AWPQkGnEwpd5X2TNOYtrz6DFIoNF/embed?start=true&loop=true&delayms=3000'
					frameborder='0'
					width='100%'
					allowfullscreen='true'
					mozallowfullscreen='true'
					webkitallowfullscreen='true'
				></iframe> */}
			</div>
		)
	}
}

export default App
