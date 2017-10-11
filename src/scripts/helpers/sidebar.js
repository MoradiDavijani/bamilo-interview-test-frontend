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
			delete window.app.user
			page.redirect('/login')
		})
}

const changePage = (page) => {
	let sidebar = $('nav.sidebar')
	sidebar.find('.nav-link').removeClass('active')
	sidebar.find(`.nav-link[href="/admin-panel/${page}"]`).addClass('active')
}

export { init, changePage }
