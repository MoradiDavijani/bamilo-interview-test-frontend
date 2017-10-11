import $ from 'jquery'
import 'treeview'
import 'selectize'
import 'util'
import 'collapse'
import FormValidator from '../helpers/forms'
import ServerSingleton from '../helpers/server'
import * as sidebar from '../helpers/sidebar'

const server = new ServerSingleton()

const init = function() {
	console.info('Admin Panel Categories Controller Started')
	let page = new AdminCategoriesPage()
	page.init()
}

class AdminCategoriesPage {
	constructor () {
		this.$collapsible = $('#newItemForm')
		this.$itemForm = this.$collapsible.find('form[name="categoryForm"]')
		this.$newItem = $('#newItem')
		this.$id = this.$itemForm.find('#_id')
		this.$title = this.$itemForm.find('#title')
		this.$parent = this.$itemForm.find('select#parent')
		this.$attributes = this.$itemForm.find('select#attributes')
		this.$description = this.$itemForm.find('#description')
		this.formValidator = new FormValidator(this.$itemForm)
		this.$treeview = $('#treeview')
		this.$reload = $('#reload')
		this.actionButtons = '<div data-id="categoryId" class="float-right">' +
			'<button class="treeview-button btn btn-primary edit mr-1">Edit</button>' +
			'<button class="treeview-button btn btn-danger delete">Delete</button>' +
			'</div>'
	}
	
	init () {
		this.fetchItems()
		sidebar.changePage('categories')
		
		this.$parentSelect = this.$parent.selectize({
			valueField: '_id',
			labelField: 'title',
			searchField: 'title',
			placeholder: 'Select parent category',
			openOnFocus: false,
			create: false,
			load: function(query, callback) {
				if (!query.length) return callback()
				server.fetch(`/categories/search?limit=10&title=${encodeURIComponent(query)}`, (result) => {
					callback(result)
				}, () => {
					callback()
				})
			}
		})
		
		this.$attributesSelect = this.$attributes.selectize({
			valueField: '_id',
			labelField: 'title',
			searchField: 'title',
			placeholder: 'Select attributes',
			openOnFocus: false,
			create: false,
			load: function(query, callback) {
				if (!query.length) return callback()
				server.fetch(`/attributes/search?limit=10&title=${encodeURIComponent(query)}`, (result) => {
					callback(result)
				}, () => {
					callback()
				})
			}
		})
		
		this.$reload.click(() => {
			this.fetchItems()
		})
		this.$itemForm.on('submit', (e) => {
			e.preventDefault()
			if (this.formValidator.validate()) {
				this.saveItem()
			}
			
		})
		$(document)
		// I know... but I have to, because of bootstrap treeview problem!
			.on('click', '.edit', (e) => {
				if (!$(e.target).is('.treeview-button')) {
					// This is to prevent conflict in other pages
					// ToDo: fix this!
					return
				}
				let $tr = $(e.target).closest('[data-id]')
				this.populateForm($tr)
			})
			.on('click', '.admin-categories-page #treeview .delete', (e) => {
				if (!$(e.target).is('.treeview-button')) {
					// This is to prevent conflict in other pages
					// ToDo: fix this!
					return
				}
				let $tr = $(e.target).closest('[data-id]'),
					id = $tr.data('id')
				id && this.deleteItem(id)
			})
		this.$newItem.click(() => {
			if (this.$collapsible.is('.show')) {
				if (this.$id.val()) {
					this.$itemForm.find('input, textarea, select').val('')
					this.$parentSelect[0].selectize.setValue('', true)
					this.$attributesSelect[0].selectize.setValue('', true)
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
	
	fetchItem (id, callback) {
		server.fetch(`/categories/${id}`, callback)
	}
	
	fetchItems () {
		this.$treeview.addClass('loading')
		server.fetch('/categories', (categories) => {
			let data = [{
				text: 'Categories',
				selectable: false,
				nodes: this.treeviewAdapter(categories)
			}]
			this.$treeview.treeview({ data, levels: 2 })
			this.$treeview.removeClass('loading')
		})
	}
	
	saveItem () {
		this.$itemForm.addClass('loading')
		server.save('/categories', {
			_id: this.$id.val(),
			title: this.$title.val(),
			parent: this.$parent.val(),
			attributes: this.$attributes.val(),
			description: this.$description.val()
		}, () => {
			this.$itemForm.find('input, textarea, select').val('')
			this.$parentSelect[0].selectize.setValue('', true)
			this.$attributesSelect[0].selectize.setValue('', true)
			this.$collapsible.collapse('hide')
			this.fetchItems()
		}, null, () => {
			this.$itemForm.removeClass('loading')
		})
	}
	
	deleteItem (id) {
		this.$treeview.addClass('loading')
		server.delete('/categories', id, null, null, () => {
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
			
			let selectize
			if (item.parent && item.parent._id) {
				selectize = this.$parentSelect[0].selectize
				selectize.addOption(item.parent)
				selectize.refreshOptions()
				selectize.setValue(item.parent._id, true)
			}
			
			selectize = this.$attributesSelect[0].selectize
			item.attributes.forEach((attribute) => {
				selectize.addOption(attribute)
			})
			selectize.refreshOptions()
			selectize.setValue(item.attributes.map(a => a._id), true)
			
			this.$itemForm.removeClass('loading')
		})
	}
	
	treeviewAdapter (categories) {
		return categories
			.map((category) => {
				return {
					text: category.title + this.actionButtons.replace('categoryId', category._id),
					nodes: this.treeviewAdapter(category.children)
				}
			})
	}
}

exports.init = init
