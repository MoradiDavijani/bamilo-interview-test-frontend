import $ from 'jquery'
import page from 'page'

const $container = $('#content'),
	routes = {
		'': {
			controller: 'home',
			view: 'home',
			title: 'Home Page'
		},
		'products': {
			controller: 'products',
			view: 'products',
			title: 'Products'
		},
		'admin-panel': {
			controller: 'admin-panel',
			title: 'Admin Panel',
			routes: {
				'login': {
					controller: 'login',
					view: 'login',
					title: 'Login'
				},
				'products': {
					controller: 'products',
					view: 'products',
					title: 'Products List'
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
	Object.keys(routesConfig).forEach((path) => {
		let route = routesConfig[path]
		page(`/${baseDir}${baseDir && path ? '/' : ''}${path}`, () => {
			document.title = route.title
			let dependencies = [
				`${baseDir}${baseDir ? '' : `${route.controller}`}/${route.controller}.controller`
			]
			if (route.view) {
				dependencies.push(`text!../views/${baseDir}/${route.view}.html`)
			}
			require(dependencies, (controllerModule, text) => {
				$container.html(text)
				controllerModule.init()
			})
		})
		registerRoutes(route.routes, `${baseDir}${path}`)
	})
}

export { init }
