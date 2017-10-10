import $ from 'jquery'
import page from 'page'
import * as auth from './helpers/auth'

const $container = $('[content-placeholder="main"]'),
	routes = {
		'': {
			controller: 'home',
			view: 'home',
			title: 'Home Page'
		},
		products: {
			controller: 'products',
			view: 'products',
			title: 'Products'
		},
		login: {
			controller: 'login',
			view: 'login',
			title: 'Login'
		},
		'admin-panel': {
			controller: 'admin-panel',
			title: 'Admin Panel',
			routes: {
				products: {
					controller: 'products',
					view: 'products',
					title: 'Products List'
				},
				categories: {
					controller: 'categories',
					view: 'categories',
					title: 'Categories List'
				},
				attributes: {
					controller: 'attributes',
					view: 'attributes',
					title: 'Attributes List'
				},
				users: {
					controller: 'users',
					view: 'users',
					title: 'Users List'
				}
			}
		}
	}

const init = () => {
	registerRoutes(routes, '')
	page.start()
}

const registerRoutes = (routesConfig, baseDir) => {
	if (!routesConfig) {
		return
	}
	let currentDir = baseDir ? baseDir.split('/').pop() : ''
	Object.keys(routesConfig).forEach((path) => {
		let route = routesConfig[path]
		page(`/${baseDir}${baseDir && path ? '/' : ''}${path}`, auth.check, () => {
			document.title = route.title
			let dependencies = [
				`${baseDir}${baseDir ? '' : `${route.controller}`}/${route.controller}.controller`
			]
			if (route.view) {
				dependencies.push(`text!../views/${baseDir}/${route.view}.html`)
			}
			if (currentDir) {
				dependencies.push(`text!../views/${baseDir}/${currentDir}.html`)
			}
			require(dependencies, (controllerModule, text, baseText) => {
				let $baseContainer
				if (baseText) {
					$container.html(baseText)
					$baseContainer = $(`[content-placeholder="${currentDir}"]`)
					$baseContainer.html(text)
				}
				else {
					$container.html(text)
				}
				controllerModule.init()
			})
		})
		registerRoutes(route.routes, `${baseDir}${path}`)
	})
}

export { init }
