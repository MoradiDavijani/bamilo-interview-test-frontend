const init = function() {
	console.info('Admin Panel Attributes Controller Started')
	let sidenav = $('nav.sidebar')
	sidenav.find('.nav-link').removeClass('active')
	sidenav.find('.nav-link[href="/admin-panel/attributes"]').addClass('active')
}

exports.init = init
