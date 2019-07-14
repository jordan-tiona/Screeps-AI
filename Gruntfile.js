module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-eslint');

    grunt.initConfig({
        //Remove all files from the dist folder
        clean: {
            options: {
                'force': true
            },

            'dist': ['dist/*'],
            'local': ['C:/Users/tiona/AppData/Local/Screeps/scripts/screeps.com/default/*']
        },

        // Push code to the dist folder, replacing '/' in path name with '.'
        copy: {
            screeps: {
              files: [{
                expand: true,
                cwd: 'src/',
                src: '**',
                dest: 'dist/',
                filter: 'isFile',
                rename: function (dest, src) {
                  // Change the path name utilizing '.' for folders
                  return dest + src.replace(/\//g,'.');
                }
              }],
            },

            local: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: '**',
                    dest: 'C:/Users/tiona/AppData/Local/Screeps/scripts/screeps.com/default',
                    filter: 'isFile'
                }]
            }
        },

        eslint: {
            target: ['./src']
        }
    });

    grunt.registerTask('default',  ['eslint', 'clean', 'copy:screeps', 'copy:local']);
}