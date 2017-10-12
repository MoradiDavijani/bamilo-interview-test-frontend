import $ from 'jquery'
import 'treeview'
import ServerSingleton from '../helpers/server'

const server = new ServerSingleton()

const init = function() {
	console.info('Products Controller Started')
	let page = new ProductsPage()
	page.init()
}

class ProductsPage {
	constructor () {
		this.perPage = 8
		this.$pageContainer = $('.products-page')
		this.$sidenav = this.$pageContainer.find('.sidenav')
		this.$productsContainer = this.$pageContainer.find('#productsContainer')
		this.$paginationContainer = this.$pageContainer.find('#paginationContainer')
		this.productTemplate = $('#productTemplate').html()
		this.filterTemplate = $('#filterTemplate').html()
		this.paginationTemplate = $('#paginationTemplate').html()
		this.$treeview = $('#treeview')
	}
	
	init () {
		this.fetchProducts([], 1)
		this.fetchCategories()
		
		this.$pageContainer
			.on('click', '[data-action="buy"]:not(.btn-success)', (e) => {
				let $target = $(e.target),
					id = $target.closest('.product-item').data('id')
				
				$target.addClass('disabled')
				this.addToShoppingCard($target, id)
			})
			.on('click', '.page-item:not(.disabled):not(.active)', (e) => {
				let $this = $(e.target),
					targetPage = $this.text(),
					currentPage = +this.$paginationContainer.find('li.active').text()
				if (targetPage === 'Next') {
					targetPage = currentPage + 1
				}
				else if (targetPage === 'Previous') {
					targetPage = currentPage - 1
				}
				let selectedCategories = this.$treeview.treeview('getSelected')
				this.fetchProducts(selectedCategories.map(c => c.id), +targetPage)
			})
	}
	
	addToShoppingCard ($target, id) {
		server.save(`/products/reserve/${id}`, {}, () => {
			let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart') || '{}')
			shoppingCart[id] = true
			localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart))
			$target.addClass('btn-success')
			$target.text('Reserved')
			$target.removeClass('btn-secondary')
		}, () => {
			$target.removeClass('disabled')
		})
	}
	
	fetchProducts (categories, page) {
		this.$pageContainer.addClass('loading')
		let skip = (page - 1) * this.perPage
		
		server.fetch(`/products/search?limit=${this.perPage}&skip=${skip}&categories=${categories.join(',')}`,
			(result) => {
				let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart') || '{}')
				this.$productsContainer.html(
					result.data.products.reduce((last, current) => {
						return last +
							this.productTemplate
								.replace('@ID', current._id)
								.replace('@TITLE', current.title)
								.replace('@MODEL', current.model)
								.replace('@PRICE', current.price)
								.replace('@IMGURL', current.imgUrl)
								.replace('@DESCRIPTION', current.description)
								.replace('@ACTION', shoppingCart[current._id] ? 'Reserved' : 'Buy')
								.replace('@BTNCLASS', shoppingCart[current._id] ?
									'btn-success disabled' : 'btn-secondary')
					}, '')
				)
				this.handlePagination(result.meta, page)
			}, null, () => {
				this.$pageContainer.removeClass('loading')
			})
	}
	
	handlePagination (meta, page) {
		let totalPages = Math.ceil(meta.total / this.perPage),
			tol = page > 1 ? (page < totalPages ? 0 : -1) : 1
		if (totalPages < 2) {
			this.$paginationContainer.html('')
			return
		}
		if (totalPages < 3) {
			tol += page - 1
		}
		this.$paginationContainer.html(
			this.paginationTemplate
				.replace('@PREV', page - 1 + tol)
				.replace('@CURRENT', page + tol)
				.replace('@NEXT', page + 1 + tol)
		)
		if (page === 1) {
			this.$paginationContainer.find('.page-item[data-page="prev"]').addClass('disabled')
			this.$paginationContainer.find('.page-item[data-page="first"]').addClass('active')
		}
		else if (page === totalPages) {
			this.$paginationContainer.find('.page-item[data-page="next"]').addClass('disabled')
			this.$paginationContainer.find('.page-item[data-page="third"]').addClass('active')
		}
		else {
			this.$paginationContainer.find('.page-item[data-page="second"]').addClass('active')
		}
		if (totalPages < 3) {
			this.$paginationContainer.find('.page-item[data-page="third"]').remove()
			if (page === 2) {
				this.$paginationContainer.find('.page-item[data-page="second"]').addClass('active')
			}
		}
	}
	
	fetchCategories () {
		this.$sidenav.addClass('loading')
		server.fetch('/categories', (categories) => {
			let data = [{
				text: 'Categories',
				selectable: false,
				nodes: this.treeviewAdapter(categories)
			}]
			this.$treeview.treeview({
				data,
				onNodeSelected: this.applyFilters.bind(this),
				onNodeUnselected: this.applyFilters.bind(this),
				multiSelect: true
			})
		}, null, () => {
			this.$sidenav.removeClass('loading')
		})
	}
	
	treeviewAdapter (categories) {
		return categories
			.map((category) => {
				return {
					text: category.title,
					id: category._id,
					selectable: !category.children || !category.children.length,
					nodes: this.treeviewAdapter(category.children)
				}
			})
	}
	
	applyFilters () {
		let selectedCategories = this.$treeview.treeview('getSelected')
		this.fetchProducts(selectedCategories.map(c => c.id), 1)
	}
}

exports.init = init
