require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  serverRuntimeConfig: {},
  publicRuntimeConfig: {
    GRAPHQL_URL: process.env.GRAPHQL_URL || 'http://localhost:3001/graphql',
  },
  webpack(config) {
    config.resolve.alias['src'] = path.join(__dirname, 'src');
    return config;
  },
};
