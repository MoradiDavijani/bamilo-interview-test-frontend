import page from 'page'
import $ from 'jquery'
import toastr from 'toastr'

let serverInstance

class ServerSingleton {
	constructor () {
		if (!serverInstance) {
			serverInstance = new Server()
		}
		return serverInstance
	}
}

class Server {
	constructor () {
		this.url = 'https://bamilo-interview-test.herokuapp.com'
	}
	
	fetch (route, onSuccess, onError) {
		this._request('GET', route, onSuccess, onError)
	}
	
	save (route, data, onSuccess, onError) {
		this._request('POST', route, onSuccess, onError, data)
	}
	
	update (route, data, onSuccess, onError) {
		this._request('PUT', route, onSuccess, onError, data)
	}
	
	delete (route, onSuccess, onError) {
		this._request('DELETE', route, onSuccess, onError)
	}
	
	_request (method, route, onSuccess, onError, data) {
		let token = localStorage.getItem('token')
		$.ajax({
			url: `${this.url}${route}`,
			headers: {
				'x-auth-token': token
			},
			data,
			method,
			success: onSuccess,
			error: (error) => {
				if (error.status === 403) {
					page.redirect('/admin-panel/login')
				}
				if (error && error.responseJSON && error.responseJSON.message) {
					toastr.error(error.responseJSON.message, error.statusText)
				}
				onError(error)
			}
		})
	}
}

export default ServerSingleton
