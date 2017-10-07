import $ from 'jquery'
import * as router from './router'

console.info('Application Started')

router.init()

$(document).ready(() => {
	$('.splash-screen').fadeOut(1000)
})
