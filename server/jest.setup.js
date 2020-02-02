// jest.setTimeout(1 * 60 * 1000);
const app = require('./index');

const env = app.get('env');

require('./tests/config/test').setup(env);
