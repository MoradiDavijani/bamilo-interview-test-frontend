import page from 'page'

const init = function() {
	console.info('Admin Panel Controller Started')
	page.redirect('/login')
}

exports.init = init
