module.exports = function (grunt) {
	
	// CONFIGURE GRUNT
	
	let isDev = process.env.NODE_ENV === 'dev',
	    modRewrite = require('connect-modrewrite');
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		eslint: {
			options: {
				configFile: '.eslintrc.json'
			},
			target: ['src/scripts/**/*.js', '!src/scripts/lib/*.js']
		},
		sasslint: {
			options: {
				configFile: '.sass-lint.yml'
			},
			target: ['src/style/**/*.scss']
		},
		clean: {
			build: {
				src: ['dist/styles/*.css', '!dist/styles/*.min.css']
			},
			old: {
				src: ['dist']
			}
		},
		babel: {
			options: {
				sourceMap: isDev,
				minified: !isDev,
				comments: isDev,
				presets: ['env'],
				plugins: ['transform-es2015-modules-amd']
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'src/scripts/',
					src: ['**/*.js'],
					dest: 'dist/scripts/'
				}]
			}
		},
		sass: {
			dist: {
				options: {
					sourcemap: isDev ? true : 'none',
					precision: 8
				},
				files: {
					'dist/styles/main.css': 'src/styles/main.scss'
				}
			}
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'dist/styles',
					src: '*.css',
					dest: 'dist/styles',
					ext: '.min.css'
				}]
			}
		},
		copy: {
			main: {
				files: [{
					expand: true,
					cwd: 'src/images/',
					src: ['**'],
					dest: 'dist/images/'
				}, {
					expand: true,
					cwd: 'src/views/',
					src: ['**'],
					dest: 'dist/views/'
				}]
			}
		},
		app: {
			styles: [
				`dist/styles/main${isDev ? '' : '.min'}.css`
			]
		},
		includeSource: {
			options: {
				basePath: '',
				baseUrl: '/',
				ordering: 'top-down'
			},
			app: {
				files: {
					'./index.html': './index.template.html'
				}
			}
		},
		connect: {
			server: {
				options: {
					port: process.env.PORT || 8000,
					livereload: isDev,
					keepalive: !isDev,
					hostname: '*',
					base: '.',
					open: false,
					middleware: function(connect, options, middlewares) {
						middlewares.unshift(modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png$ /index.html [L]']));
						
						return middlewares;
					}
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			html: {
				files: ['index.template.html'],
				tasks: ['includeSource']
			},
			assets: {
				files: ['src/views/**/*.html', 'src/images/**/*.*'],
				tasks: ['copy']
			},
			scripts: {
				files: ['src/scripts/**/*.js'],
				tasks: ['eslint', 'babel']
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
	grunt.loadNpmTasks('grunt-contrib-clean')
	grunt.loadNpmTasks('grunt-babel')
	grunt.loadNpmTasks('grunt-sass')
	grunt.loadNpmTasks('grunt-contrib-cssmin')
	grunt.loadNpmTasks('grunt-contrib-copy')
	grunt.loadNpmTasks('grunt-include-source')
	grunt.loadNpmTasks('grunt-contrib-connect')
	grunt.loadNpmTasks('grunt-contrib-watch')
	
	// Define GRUNT Commands
	grunt.registerTask('lint', ['eslint', 'sasslint'])
	grunt.registerTask('build',
		isDev ?
			['eslint', 'sasslint', 'clean:old', 'sass', 'copy', 'includeSource', 'babel', 'connect', 'watch'] :
			['eslint', 'sasslint', 'clean:old', 'sass', 'cssmin', 'copy', 'includeSource', 'babel', 'clean:build',
				'connect']
	)
}