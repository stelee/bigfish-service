module.exports = function (grunt) {
    'use strict';

    var srcDir = 'src';
    var outDir = 'build';

    grunt.initConfig({
        ts: {
            options: {
                target: 'es5',
                module: 'commonjs',
                sourceMap: false,
                declaration: false,
                noImplicitAny: false,
                removeComments: true,
                noLib: false,
            },
            dev: {
                src: [srcDir + '/**/*.ts'],
                outDir: outDir,
                watch: srcDir
            },
            build: {
                src: [srcDir + '/**/*.ts'],
                outDir: outDir,
            },
        },
        clean: {
            build:{
                src: 'build/**/*',
            }
        },
        copy:{
          config:{
            expand: true,
            cwd: srcDir + "/config/",
            src: "*",
            dest: outDir + "/config/"
          }
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-dts-bundle');
    grunt.loadNpmTasks('grunt-ts-clean');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['ts:dev']);
    grunt.registerTask('cleanbuild',['clean:build']);
    grunt.registerTask('build', ['ts:build','copy:config']);
    grunt.registerTask('rebuild', ['clean:build','ts:build','copy:config']);
};
