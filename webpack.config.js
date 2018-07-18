var path = require("path");
var pl = require('./myplugin.js');
module.exports = {
    entry: path.join(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.result.js'
    },
    plugins: [
        new pl()
    ]
};