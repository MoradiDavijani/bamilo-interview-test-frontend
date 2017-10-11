import $ from 'jquery'
import 'util'
import 'collapse'
import FormValidator from '../helpers/forms'
import ServerSingleton from '../helpers/server'
import * as sidebar from '../helpers/sidebar'

const server = new ServerSingleton()

const init = function() {
	console.info('Admin Panel Attributes Controller Started')
	let page = new AdminAttributesPage()
	page.init()
}

class AdminAttributesPage {
	constructor () {
		this.$collapsible = $('#newItemForm')
		this.$itemForm = this.$collapsible.find('form[name="attributeForm"]')
		this.$newItem = $('#newItem')
		this.$id = this.$itemForm.find('#_id')
		this.$title = this.$itemForm.find('#title')
		this.$description = this.$itemForm.find('#description')
		this.formValidator = new FormValidator(this.$itemForm)
		this.$table = $('.admin-attributes-page table tbody')
		this.$reload = $('#reload')
		this.actionButtons = '<button class="btn btn-primary edit mr-1">Edit</button>' +
			'<button class="btn btn-danger delete">Delete</button>'
	}
	
	init () {
		this.fetchItems()
		sidebar.changePage('attributes')
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
					this.$title.val('')
					this.$description.val('')
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
		server.fetch('/attributes', (attributes) => {
			this.$table.html('')
			attributes.forEach((attribute, index) => {
				this.$table.append(
					$('<tr>')
						.append(
							$('<td>').text(index + 1)
						)
						.append(
							$('<td>').text(attribute.title)
						)
						.append(
							$('<td layout="row" layout-align="end center">').html(this.actionButtons)
						)
						.data('id', attribute._id)
				)
			})
			this.$table.removeClass('loading')
		})
	}
	
	fetchItem (id, callback) {
		server.fetch(`/attributes/${id}`, callback)
	}
	
	saveItem () {
		this.$itemForm.addClass('loading')
		server.save('/attributes', {
			_id: this.$id.val(),
			title: this.$title.val(),
			description: this.$description.val()
		}, () => {
			this.fetchItems()
		}, null, () => {
			this.$itemForm.find('input, textarea, select').val('')
			this.$itemForm.removeClass('loading')
			this.$collapsible.collapse('hide')
		})
	}
	
	deleteItem (id) {
		this.$table.addClass('loading')
		server.delete('/attributes', id, null, null, () => {
			this.fetchItems()
		})
	}
	
	populateForm ($tr) {
		this.$collapsible.collapse('show')
		this.$itemForm.addClass('loading')
		
		this.fetchItem($tr.data('id'), (item) => {
			this.$id.val(item._id)
			this.$title.val(item.title)
			this.$description.val(item.description)
			this.$itemForm.removeClass('loading')
		})
	}
}

exports.init = init
