requirejs.config({
	'paths': {
		'jquery': 'node_modules/jquery/dist/jquery'
	}
})
requirejs(['dist/scripts/app'], function(app) {})