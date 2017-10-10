import $ from 'jquery'
import ServerSingleton from '../helpers/server'
import * as sidebar from '../helpers/sidebar'

const server = new ServerSingleton()

const init = function() {
	console.info('Admin Panel Users Controller Started')
	let page = new AdminUsersPage()
	page.init()
}

class AdminUsersPage {
	constructor () {
		this.$table = $('.admin-users-page table tbody')
		this.$reload = $('#reload')
	}
	
	init () {
		this.fetchUsers()
		sidebar.changePage('users')
		this.$reload.click(() => {
			this.fetchUsers()
		})
	}
	
	fetchUsers () {
		this.$table.addClass('loading')
		server.fetch('/users', (users) => {
			this.$table.html('')
			users.forEach((user, index) => {
				this.$table.append(
					$('<tr>')
						.append(
							$('<td>').text(index + 1)
						)
						.append($('<td>').text(user.username)
						)
				)
			})
			this.$table.removeClass('loading')
		})
	}
}

exports.init = init
