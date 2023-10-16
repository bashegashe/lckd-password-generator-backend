const slsw = require('serverless-webpack');
const path = require('path');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    }
  }
}