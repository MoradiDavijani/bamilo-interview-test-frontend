import $ from 'jquery'
import toastr from 'toastr'
import * as router from './app.router'

console.info('Application Started')

router.init()

toastr.options.closeButton = true
toastr.options.closeDuration = 0
toastr.options.progressBar = true

$(document).ready(() => {
	$('.splash-screen').fadeOut(1000)
})
