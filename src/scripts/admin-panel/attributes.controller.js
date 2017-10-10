import $ from 'jquery'
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
		this.$table = $('.admin-attributes-page table tbody')
		this.$reload = $('#reload')
	}
	
	init () {
		this.fetchAttributes()
		sidebar.changePage('attributes')
		this.$reload.click(() => {
			this.fetchAttributes()
		})
	}
	
	fetchAttributes () {
		this.$table.addClass('loading')
		server.fetch('/attributes', (attributes) => {
			this.$table.html('')
			attributes.forEach((attribute, index) => {
				this.$table.append(
					$('<tr>')
						.append(
							$('<td>').text(index + 1)
						)
						.append($('<td>').text(attribute.title)
						)
				)
			})
			this.$table.removeClass('loading')
		})
	}
}

exports.init = init
