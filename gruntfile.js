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
		clean: {
			build: {
				src: ['dist/styles/app.css']
			},
			old: {
				src: ['dist']
			}
		},
		babel: {
			options: {
				sourceMap: isDev,
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
		copy: {
			main: {
				files: [{
					expand: true,
					cwd: 'src/images/',
					src: ['**'],
					dest: 'dist/images/'
				}]
			}
		},
		app: {
			styles: [
				`dist/styles/app${isDev ? '' : '.min'}.css`
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
		watch: {
			options: {
				livereload: true
			},
			html: {
				files: ['index.template.html'],
				tasks: ['includeSource']
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