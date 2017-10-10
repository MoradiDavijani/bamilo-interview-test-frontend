import $ from 'jquery'
import treeview from 'treeview'
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
		this.$reload = $('#reload')
		this.$treeview = $('#treeview')
	}
	
	init () {
		this.fetchCategories()
		sidebar.changePage('categories')
		this.$reload.click(() => {
			this.fetchCategories()
		})
	}
	
	fetchCategories () {
		this.$treeview.addClass('loading')
		server.fetch('/categories', (categories) => {
			let data = [{
				text: 'Categories',
				selectable: false,
				nodes: this.treeviewAdapter(categories)
			}]
			console.log(data)
			this.$treeview.treeview({ data, levels: 2 })
			this.$treeview.removeClass('loading')
		})
	}
	
	treeviewAdapter (categories) {
		return categories
			.map((category) => {
				return {
					text: category.title,
					selectable: false,
					nodes: this.treeviewAdapter(category.children)
				}
			})
	}
}

exports.init = init
