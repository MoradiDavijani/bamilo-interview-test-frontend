requirejs.config({
	baseUrl: './dist/scripts',
	'paths': {
		'jquery': '../../node_modules/jquery/dist/jquery',
		'page': 'lib/page',
	}
})
requirejs(['app'], function(app) {})