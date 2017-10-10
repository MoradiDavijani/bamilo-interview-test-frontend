const init = function() {
	console.info('Admin Panel Categories Controller Started')
	let sidenav = $('nav.sidebar')
	sidenav.find('.nav-link').removeClass('active')
	sidenav.find('.nav-link[href="/admin-panel/categories"]').addClass('active')
}

exports.init = init
