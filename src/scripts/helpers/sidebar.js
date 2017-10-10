import $ from 'jquery'
import page from 'page'

const init = () => {
	$(document)
		.on('click', '.sidebar-toggle', function() {
			let $this = $(this),
				$sidebar = $('.sidebar')
			
			$sidebar.toggleClass('active')
			$this.toggleClass('active')
		})
		.on('click', '#logout', function() {
			localStorage.removeItem('token')
			page.redirect('/login')
		})
}

const changePage = (page) => {
	let sidenav = $('nav.sidebar')
	sidenav.find('.nav-link').removeClass('active')
	sidenav.find(`.nav-link[href="/admin-panel/${page}"]`).addClass('active')
}

export { init, changePage }
