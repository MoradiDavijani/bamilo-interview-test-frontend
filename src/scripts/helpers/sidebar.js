import $ from 'jquery'
import page from 'page'

const init = () => {
	$(document).on('click', '.sidebar-toggle', function() {
		let $this = $(this),
			$sidebar = $('.sidebar')
		
		$sidebar.toggleClass('active')
		$this.toggleClass('active')
	})
}

export { init }
