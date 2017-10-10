import page from 'page'

const init = function() {
	console.info('Admin Panel Controller Started')
	page.redirect('/admin-panel/products')
}

exports.init = init
