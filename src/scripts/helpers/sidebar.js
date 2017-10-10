import $ from 'jquery'

const init = () => {
	$(document).on('click', '.sidebar-toggle', function() {
		let $this = $(this),
			$sidebar = $('.sidebar')
		
		$sidebar.toggleClass('active')
		$this.toggleClass('active')
	})
}

export { init }
