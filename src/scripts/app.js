import name from './test'

const $ = require('jquery')

let a = `
hello there...
I am ${name}
`

$(document).ready(() => {
	$('.splash-screen').fadeOut(1000)
})

console.log(a)
