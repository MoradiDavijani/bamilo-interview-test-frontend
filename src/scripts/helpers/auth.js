import page from 'page'
import ServerSingleton from '../helpers/server'

const server = new ServerSingleton()

const validateUserToken = (next) => {
	server.fetch('/auth', (result) => {
		if (result && result.username) {
			next()
		}
		else {
			page.redirect('/login')
		}
	}, () => {
		page.redirect('/login')
	})
}

const check = (ctx, next) => {
	if (ctx.path.startsWith('/admin-panel')) {
		validateUserToken(next)
	}
	else {
		next()
	}
}

export { check }
