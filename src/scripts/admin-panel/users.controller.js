const init = function() {
	console.info('Admin Panel Users Controller Started')
	let sidenav = $('nav.sidebar')
	sidenav.find('.nav-link').removeClass('active')
	sidenav.find('.nav-link[href="/admin-panel/users"]').addClass('active')
}

exports.init = init
