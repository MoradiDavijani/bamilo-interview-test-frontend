requirejs.config({
	baseUrl: '/dist/scripts',
	'paths': {
		'jquery': '../../node_modules/jquery/dist/jquery',
		'text': '../../node_modules/text/text',
		'page': 'lib/page',
	}
})
requirejs(['app.controller'], function(app) {})