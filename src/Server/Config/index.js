
const productionConfig = require('./prod');
const stagingConfig = require('./uat');
const localConfig = require('./local');

const NODE_ENV = process.env.NODE_ENV;

var configBuffer;

switch (NODE_ENV) {
   case 'production':
      configBuffer = productionConfig;
      break;
   case 'uat':
      configBuffer = stagingConfig;
      break;
   default:
      configBuffer = localConfig;
}

// Overrider config from consul/environment variables
// Object.keys(process.env).forEach(function (envKey) {
//    if (envKey.indexOf("API_") === 0) {
//        const API_KEY = envKey.replace("API_", "");
//        configBuffer[API_KEY] = process.env[envKey];
//    }
// });

module.exports = configBuffer;