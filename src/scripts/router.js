import $ from 'jquery'
import page from 'page'

const $container = $('#content'),
	routes = {
		'/': {
			controller: 'home',
			view: 'home',
			title: 'Home Page'
		},
		'/products': {
			controller: 'products',
			view: 'products',
			title: 'Products'
		},
		'/admin-panel': {
			controller: 'admin-panel',
			view: 'admin-panel',
			title: 'Admin Panel'
		}
	}

const init = () => {
	Object.keys(routes).forEach((path) => {
		let route = routes[path]
		page(path, () => {
			document.title = route.title
			require([`text!../views/${route.view}.html`, `controllers/${route.controller}`],
				(text, controllerModule) => {
					$container.html(text)
					controllerModule.init()
				})
		})
	})
	page.redirect('*', '/')
	
	page.start()
}

export { init }
