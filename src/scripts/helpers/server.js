import $ from 'jquery'

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
				console.log(error)
				onError(error)
			}
		})
	}
}

export default ServerSingleton
