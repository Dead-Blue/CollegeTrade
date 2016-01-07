module.exports= function(grunt){
	grunt.initConfig({
		env: {
			test: {
				NODE_ENV: 'test'
			},
			dev: {
				NODE_ENV: 'development'
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					ext: 'js,html',
					watch: ['server.js','Config/**/*.js','Server/**/*.js']
				}
			},
			debug: {
				script: 'Server.js',
				option: {
					nodeAgs: ['--debug'],
					ext: 'js,html',
					watch: ['Server.js', 'Config/**/*.js','Server/**/*.js']
				}
			}
		},
		mochaTest: {
			src: 'Server/tests/**/*.js',
			options: {
				reporter: 'spec'
			}
		},
		// karma:{
		// 	unit: {
		// 		configFile: 'karma.conf.js'
		// 	}
		// },
		// protractor: {
		// 	e2e: {
		// 		optios: {
		// 			configFile: 'protractor.conf.js'
		// 		}
		// 	}
		// },
		jshint: {
			all: {
				src: ['Server.js', 'Config/**/*.js', 'Client/js/*.js']
			}
		},
		csslint: {
			all: {
				src: 'Client/**/*.css'
			}
		},
		watch: {
			js: {
				files: ['Server.js','Config/**/*.js','Server/**/*.js','Client/**/*.js'],
				tasks: ['jshint']
			},
			css: {
				files: 'Client/**/*.css',
				tasks: ['csslint']
			},
		},
		concurrent: {
				dev: {
					tasks: ['nodemon', 'watch'],
					options: {
						logConcurrentOutput: true
					}
				},
				debug: {
					tasks: ['nodemon:debug','watch','node-inspector'],
					options: {
						logConcurrentOutput: true
					}
				}
			},
			'node-inspector': {
				debug: {}
			}
	});
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-mocha-test');
	// grunt.loadNpmTasks('grunt-karma');
	// grunt.loadNpmTasks('grunt-protractor-runner');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-node-inspector');
	
	grunt.registerTask('default',['env:dev','concurrent:dev']);
	grunt.registerTask('debug',['env:dev','lint','concurrent:debug']);
	// grunt.registerTask('test',['env:test','mocha','karma','protractor']);
	grunt.registerTask('test',['env:test','mochaTest']);
	grunt.registerTask('lint',['jshint','csslint']);
	
}