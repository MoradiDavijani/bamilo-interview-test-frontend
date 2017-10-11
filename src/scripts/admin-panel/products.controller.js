import $ from 'jquery'
import 'selectize'
import 'util'
import 'collapse'
import FormValidator from '../helpers/forms'
import ServerSingleton from '../helpers/server'
import * as sidebar from '../helpers/sidebar'

const server = new ServerSingleton()

const init = function() {
	console.info('Admin Panel Products Controller Started')
	let page = new AdminProductsPage()
	page.init()
}

class AdminProductsPage {
	constructor () {
		this.attributesContainer = $('#attributesContainer')
		this.$collapsible = $('#newItemForm')
		this.$itemForm = this.$collapsible.find('form[name="productForm"]')
		this.$newItem = $('#newItem')
		this.$id = this.$itemForm.find('#_id')
		this.$title = this.$itemForm.find('#title')
		this.$category = this.$itemForm.find('select#category')
		this.$model = this.$itemForm.find('#model')
		this.$imgUrl = this.$itemForm.find('#imgUrl')
		this.$description = this.$itemForm.find('#description')
		this.$price = this.$itemForm.find('#price')
		this.$status = this.$itemForm.find('#status')
		this.$quantity = this.$itemForm.find('#quantity')
		this.formValidator = new FormValidator(this.$itemForm)
		this.$table = $('.admin-products-page table tbody')
		this.$reload = $('#reload')
		this.actionButtons = '<button class="btn btn-primary edit mr-1">Edit</button>' +
			'<button class="btn btn-danger delete">Delete</button>'
	}
	
	init () {
		this.fetchItems()
		sidebar.changePage('products')
		
		this.$categorySelect = this.$category.selectize({
			valueField: '_id',
			labelField: 'title',
			searchField: 'title',
			placeholder: 'Select category',
			openOnFocus: false,
			create: false,
			load: function(query, callback) {
				if (!query.length) return callback()
				server.fetch(`/categories/search?limit=10&title=${encodeURIComponent(query)}`, (result) => {
					callback(result)
				}, () => {
					callback()
				})
			},
			onChange: (categoryId) => {
				this.populateAttributes(categoryId)
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
					this.$itemForm.find('input, textarea, select').val('')
					this.$categorySelect[0].selectize.setValue('', true)
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
		server.fetch(`/products/${id}`, callback)
	}
	
	fetchItems () {
		this.$table.addClass('loading')
		server.fetch('/products', (products) => {
			this.$table.html('')
			products.forEach((product, index) => {
				this.$table.append(
					$('<tr>')
						.append(
							$('<td>').text(index + 1)
						)
						.append($('<td>').text(product.title)
						)
						.append(
							$('<td>').text(product.category && product.category.title)
						)
						.append(
							$('<td>').text(product.price)
						)
						.append(
							$('<td>').text(product.quantity)
						)
						.append(
							$('<td layout="row" layout-align="end center">').html(this.actionButtons)
						)
						.data('id', product._id)
				)
			})
			this.$table.removeClass('loading')
		})
	}
	
	saveItem () {
		this.$itemForm.addClass('loading')
		server.save('/products', {
			_id: this.$id.val(),
			title: this.$title.val(),
			category: this.$category.val(),
			attributes: this.getAttributeValues(),
			model: this.$model.val(),
			imgUrl: this.$imgUrl.val(),
			description: this.$description.val(),
			price: this.$price.val(),
			status: this.$status.val(),
			quantity: this.$quantity.val()
		}, () => {
			this.$itemForm.find('input, textarea, select').val('')
			this.$categorySelect[0].selectize.setValue('', true)
			this.$collapsible.collapse('hide')
			this.fetchItems()
		}, null, () => {
			this.$itemForm.removeClass('loading')
		})
	}
	
	getAttributeValues () {
		let attributes = []
		this.attributesContainer.find('input').each((index, input) => {
			attributes.push({
				attribute: input.id,
				value: input.value
			})
		})
		return attributes
	}
	
	deleteItem (id) {
		this.$table.addClass('loading')
		server.delete('/products', id, null, null, () => {
			this.fetchItems()
		})
	}
	
	populateAttributes (categoryId) {
		if (!categoryId) {
			return
		}
		let attributesCollapsible = $('#attributesCollapsible'),
			attributeTemplate = $('#attributeTemplate').html()
		
		attributesCollapsible.collapse('show')
		attributesCollapsible.addClass('loading')
		
		let html = '',
			attributes = this.$categorySelect[0].selectize.options[categoryId].attributes
		attributes.forEach((attribute) => {
			html += attributeTemplate
				.replace(/attributesTitle/g, attribute.title)
				.replace(/attributesId/g, attribute._id)
		})
		this.attributesContainer.html(html)
		attributesCollapsible.removeClass('loading')
	}
	
	populateForm ($tr) {
		this.$collapsible.collapse('show')
		this.$itemForm.addClass('loading')
		
		this.fetchItem($tr.data('id'), (item) => {
			this.$id.val(item._id)
			this.$title.val(item.title)
			
			this.$model.val(item.model)
			this.$imgUrl.val(item.imgUrl)
			this.$description.val(item.description)
			this.$price.val(item.price)
			this.$status.val(item.status)
			this.$quantity.val(item.quantity)
			
			if (item.category && item.category._id) {
				server.fetch(`/categories/${item.category._id}`, (category) => {
					let selectize = this.$categorySelect[0].selectize
					
					selectize.addOption(category)
					selectize.refreshOptions()
					selectize.setValue(category._id, true)
					this.populateAttributes(category._id)
					this.setAttributes(item.attributes)
					this.$itemForm.removeClass('loading')
				})
			}
			else {
				this.$itemForm.removeClass('loading')
			}
		})
	}
	
	setAttributes (attributes) {
		attributes.forEach((attribute) => {
			let $attribute = $(`#${attribute.attribute._id}`)
			
			$attribute.val(attribute.value)
		})
	}
}

exports.init = init
