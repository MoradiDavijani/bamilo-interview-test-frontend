module.exports = function (grunt) {
	
	// CONFIGURE GRUNT
	
	let isDev = process.env.NODE_ENV === 'dev'
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		eslint: {
			options: {
				configFile: '.eslintrc.json'
			},
			target: 'src/scripts/**/*.js'
		},
		sasslint: {
			options: {
				configFile: '.sass-lint.yml'
			},
			target: ['src/style/**/*.scss']
		},
		sass: {
			dist: {
				options: {
					sourcemap: isDev ? true : 'none'
				},
				files: {
					'dist/styles/app.css': 'src/styles/app.scss'
				}
			}
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'dist/styles',
					src: 'app.css',
					dest: 'dist/styles',
					ext: '.min.css'
				}]
			}
		},
		app: isDev ? {
			scripts: [
				'dist/scripts/app.js'
			],
			styles: [
				'dist/styles/app.css'
			]
		} : {
			scripts: [
				'dist/scripts/app.js'
			],
			styles: [
				'dist/styles/app.min.css'
			]
		},
		includeSource: {
			options: {
				basePath: './',
				baseUrl: '',
				ordering: 'top-down'
			},
			app: {
				files: {
					'./index.html': './index.template.html'
				}
			}
		},
		clean: {
			build: {
				src: ['dist/styles/app.css']
			}
		},
		connect: {
			server: {
				options: {
					port: 8000,
					livereload: isDev,
					keepalive: !isDev,
					hostname: '*',
					open: false
				}
			}
		},
		browserify: {
			dist: {
				options: {
					transform: [
						['babelify', { presets: ['env'] }]
					],
					browserifyOptions: { debug: isDev }
				},
				files: {
					'dist/scripts/app.js': ['src/scripts/**/*.js']
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			scripts: {
				files: ['src/scripts/**/*.js'],
				tasks: ['eslint', 'browserify']
			},
			styles: {
				files: ['src/styles/**/*.scss'],
				tasks: ['sasslint', 'sass']
			}
		}
	})
	
	// LOAD GRUNT PLUGINS
	grunt.loadNpmTasks('grunt-eslint')
	grunt.loadNpmTasks('grunt-sass-lint')
	grunt.loadNpmTasks('grunt-sass')
	grunt.loadNpmTasks('grunt-contrib-cssmin')
	grunt.loadNpmTasks('grunt-include-source')
	grunt.loadNpmTasks('grunt-contrib-clean')
	grunt.loadNpmTasks('grunt-contrib-connect')
	grunt.loadNpmTasks('grunt-browserify')
	grunt.loadNpmTasks('grunt-contrib-watch')
	
	// Define GRUNT Commands
	grunt.registerTask('lint', ['eslint', 'sasslint'])
	grunt.registerTask('build',
		isDev ?
			['eslint', 'sasslint', 'sass', 'includeSource', 'browserify', 'connect', 'watch'] :
			['eslint', 'sasslint', 'sass', 'cssmin', 'includeSource', 'clean', 'browserify', 'connect'])
}