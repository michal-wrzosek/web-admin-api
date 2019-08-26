require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  serverRuntimeConfig: {},
  publicRuntimeConfig: {
    GRAPHQL_URL_SERVER: process.env.GRAPHQL_URL_SERVER || 'http://waa-api:8080/graphql',
    GRAPHQL_URL_CLIENT: process.env.GRAPHQL_URL_CLIENT || 'http://localhost:3001/graphql',
  },
  webpack(config) {
    config.resolve.alias['src'] = path.join(__dirname, 'src');
    return config;
  },
};
