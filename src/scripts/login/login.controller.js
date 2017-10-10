import page from 'page'
import $ from 'jquery'
import FormValidator from '../helpers/forms'
import ServerSingleton from '../helpers/server'

const server = new ServerSingleton()

const init = function() {
	console.info('Login Controller Started')
	let page = new LoginPage()
	page.init()
}

class LoginPage {
	constructor () {
		this.$loginForm = $('form[name="loginForm"]')
		this.$username = $('#username')
		this.$password = $('#password')
		this.formValidator = new FormValidator(this.$loginForm)
	}
	
	init () {
		this.$loginForm.on('submit', (e) => {
			e.preventDefault()
			if (this.formValidator.validate()) {
				this.login()
			}
			
		})
	}
	
	login () {
		this.$loginForm.addClass('loading')
		server.save('/auth', {
			username: this.$username.val(),
			password: this.$password.val()
		}, (result) => {
			if (result && result.token) {
				localStorage.setItem('token', result.token)
				page.redirect('/admin-panel/products')
			}
		}, null, () => {
			this.$loginForm.removeClass('loading')
		})
	}
}

exports.init = init
