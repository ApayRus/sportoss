import React from 'react'
import { Typography } from '@material-ui/core'

function InviteMessage({ inviteInfo }) {
	const { fullName, email, clubName, inviterName } = inviteInfo

	console.log('inviteInfo', inviteInfo)
	console.log('inviteInfo.roles', inviteInfo.roles)

	const messageForAdminBeforeClubRegistration = (
		<Typography variant='body2' color='primary'>
			Регистрируйтесь через эту форму только если хотите создать новый клуб. Если ваш клуб уже
			зарегистрирован и вы хотите присоединиться к нему, свяжитесь с админом клуба чтобы он прислал
			вам ссылку - приглашение для регистрации.
		</Typography>
	)

	const messageForTrainerByInviteFromClubAdmin = (
		<Typography variant='body2' color='primary'>
			Уважаемый <strong>{fullName}</strong>. Вас приглашает <strong>{inviterName}</strong>{' '}
			зарегистрироваться в качестве тренера клуба <strong>{clubName}</strong>.
		</Typography>
	)

	return (
		<div>
			{!email ? messageForAdminBeforeClubRegistration : messageForTrainerByInviteFromClubAdmin}
		</div>
	)
}

export default InviteMessage
