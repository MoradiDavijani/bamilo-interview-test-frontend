import page from 'page'

const init = function() {
	console.info('Admin Panel Controller Started')
	page.redirect('/admin-panel/login')
}

exports.init = init
