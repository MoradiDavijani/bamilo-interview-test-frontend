import $ from 'jquery'
import 'util'
import 'collapse'
import FormValidator from '../helpers/forms'
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
		this.$collapsible = $('#newItemForm')
		this.$itemForm = this.$collapsible.find('form[name="userForm"]')
		this.$newItem = $('#newItem')
		this.$id = this.$itemForm.find('#_id')
		this.$username = this.$itemForm.find('#username')
		this.$password = this.$itemForm.find('#password')
		this.formValidator = new FormValidator(this.$itemForm)
		this.$table = $('.admin-users-page table tbody')
		this.$reload = $('#reload')
		this.actionButtons = '<button class="btn btn-primary edit mr-1">Edit</button>' +
			'<button class="btn btn-danger delete">Delete</button>'
	}
	
	init () {
		this.fetchItems()
		sidebar.changePage('users')
		this.$reload.click(() => {
			this.fetchItems()
		})
		this.$itemForm.on('submit', (e) => {
			e.preventDefault()
			if (this.formValidator.validate()) {
				this.saveItem()
			}
			
		})
		this.$table.on('click', '.edit', (e) => {
			let $tr = $(e.target).closest('tr')
			this.populateForm($tr)
		})
		this.$table.on('click', '.delete', (e) => {
			let $tr = $(e.target).closest('tr'),
				id = $tr.data('id')
			id && this.deleteItem(id)
		})
		this.$newItem.click(() => {
			if (this.$collapsible.is('.show')) {
				if (this.$id.val()) {
					this.$id.val('')
					this.$username.val('')
					this.$password.val('')
				}
				else {
					this.$collapsible.collapse('hide')
				}
			}
			else {
				this.$collapsible.collapse('show')
			}
		})
	}
	
	fetchItems () {
		this.$table.addClass('loading')
		server.fetch('/users', (users) => {
			this.$table.html('')
			users.forEach((user, index) => {
				this.$table.append(
					$('<tr>')
						.append(
							$('<td>').text(index + 1)
						)
						.append(
							$('<td data-field="username">').text(user.username)
						)
						.append(
							$('<td layout="row" layout-align="end center">').html(this.actionButtons)
						)
						.data('id', user._id)
				)
			})
			this.$table.removeClass('loading')
		})
	}
	
	saveItem () {
		this.$itemForm.addClass('loading')
		server.save('/users', {
			_id: this.$id.val(),
			username: this.$username.val(),
			password: this.$password.val()
		}, () => {
			this.fetchItems()
		}, null, () => {
			this.$itemForm.find('input').val('')
			this.$itemForm.removeClass('loading')
			this.$collapsible.collapse('hide')
		})
	}
	
	deleteItem (id) {
		this.$table.addClass('loading')
		server.delete('/users', id, null, null, () => {
			this.fetchItems()
		})
	}
	
	populateForm ($tr) {
		this.$id.val($tr.data('id'))
		this.$username.val($tr.find('td[data-field="username"]').text())
		this.$password.val('')
		this.$collapsible.collapse('show')
		
	}
}

exports.init = init
