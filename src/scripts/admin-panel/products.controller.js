const init = function() {
	console.info('Admin Panel Products Controller Started')
	let sidenav = $('nav.sidebar')
	sidenav.find('.nav-link').removeClass('active')
	sidenav.find('.nav-link[href="/admin-panel/products"]').addClass('active')
}

exports.init = init
