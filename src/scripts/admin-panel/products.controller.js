import $ from 'jquery'
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
		this.$table = $('.admin-products-page table tbody')
		this.$reload = $('#reload')
	}
	
	init () {
		this.fetchProducts()
		sidebar.changePage('products')
		this.$reload.click(() => {
			this.fetchProducts()
		})
	}
	
	fetchProducts () {
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
				)
			})
			this.$table.removeClass('loading')
		})
	}
}

exports.init = init
