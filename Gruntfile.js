module.exports = function (grunt) {
    grunt.initConfig({
        sass: {
            dist: {
                files: {
                    'jquery.selectbox.css':
                        'jquery.selectbox.scss'
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 version', '> 1%', 'ie 8', 'Firefox 4']
            },
            dist: {
                files: {
                    'jquery.selectbox.css':
                        'jquery.selectbox.css'
                }
            }
        },
        cssmin: {
            files: {
                'jquery.selectbox.min.css':
                    'jquery.selectbox.css'
            }
        },
        coffee: {
            dist: {
                files: {
                    'jquery.selectbox.coffee.js':
                        'jquery.selectbox.coffee'
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'jquery.selectbox.coffee.js':
                        'jquery.selectbox.coffee.js'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('styles', ['sass', 'autoprefixer']);
    grunt.registerTask('scripts', ['coffee']);
    grunt.registerTask('default', ['sass', 'autoprefixer', 'cssmin', 'coffee', 'uglify']);
};
