import page from 'page'

const routes = {
	'/': {
		controller: 'home',
		title: 'Home Page'
	},
	'/products': {
		controller: 'products',
		title: 'Products'
	},
	'/admin-panel': {
		controller: 'admin-panel',
		title: 'Admin Panel'
	}
}

const init = () => {
	Object.keys(routes).forEach((path) => {
		let route = routes[path]
		page(path, () => {
			document.title = route.title
			require([`controllers/${route.controller}`], (controllerModule) => {
				controllerModule.init()
			})
		})
	})
	page.redirect('*', '/')
	
	page.start()
}

export { init }
