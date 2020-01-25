// jest.setTimeout(1 * 60 * 1000);
const app = require('./api/index');

const env = app.get('env');

require('./tests/config/test').setup(env);

const dbHandler = require('./tests/util/db');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await dbHandler.connect();
  console.log('connected');
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => {
  await dbHandler.clearDatabase();
  console.log('cleared');
});

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
  await dbHandler.closeDatabase();
  console.log('closed');
});
