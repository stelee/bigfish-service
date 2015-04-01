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
        ts_clean: {
            build:{
                options: {
                // set to true to print files 
                verbose: true
                },
                src: [outDir+'/**/*'],
                dot: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-dts-bundle');
    grunt.loadNpmTasks('grunt-ts-clean');
    grunt.registerTask('default', ['ts:dev']);
    grunt.registerTask('clean',['ts_clean:build']);
    grunt.registerTask('build', ['ts:build']);
};
