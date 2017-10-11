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
	
	fetch (route, onSuccess, onError, onComplete) {
		this._request('GET', route, onSuccess, onError, onComplete)
	}
	
	save (route, data, onSuccess, onError, onComplete) {
		if (data._id) {
			this._request('PUT', `${route}/${data._id}`, onSuccess, onError, onComplete, data)
		}
		else {
			delete data._id
			this._request('POST', route, onSuccess, onError, onComplete, data)
		}
	}
	
	delete (route, id, onSuccess, onError, onComplete) {
		this._request('DELETE', `${route}/${id}`, onSuccess, onError, onComplete)
	}
	
	_request (method, route, onSuccess, onError, onComplete, data) {
		this._normalize(data)
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
					localStorage.removeItem('token')
					page.redirect('/login')
				}
				if (error && error.responseJSON && error.responseJSON.message) {
					toastr.error(error.responseJSON.message, error.statusText)
				}
				onError && onError(error)
			},
			complete: onComplete
		})
	}
	
	_normalize (data) {
		if (!data) {
			return
		}
		Object.keys(data).forEach((key) => {
			if (!data[key]) {
				delete data[key]
			}
		})
	}
}

export default ServerSingleton
