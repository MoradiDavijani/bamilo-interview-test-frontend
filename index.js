requirejs.config({
	baseUrl: '/dist/scripts',
	'paths': {
		'jquery': '../../node_modules/jquery/dist/jquery',
		'util': '../../node_modules/bootstrap/js/dist/util',
		'collapse': '../../node_modules/bootstrap/js/dist/collapse',
		'toastr': '../../node_modules/toastr/toastr',
		'text': '../../node_modules/text/text',
		'page': 'lib/page',
		'treeview': 'lib/treeview'
	}
})

requirejs(['app.controller'], function(app) {})
