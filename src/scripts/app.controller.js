import $ from 'jquery'
import toastr from 'toastr'
import * as sidebar from './helpers/sidebar'
import * as router from './app.router'

console.info('Application Started')

router.init()
sidebar.init()

toastr.options.closeButton = true
toastr.options.timeOut = 2000
toastr.options.closeDuration = 0
toastr.options.progressBar = true

$(document).ready(() => {
	$('.splash-screen').fadeOut(1000)
})
