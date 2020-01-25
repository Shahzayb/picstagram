const app = require('./api/index');

const env = app.get('env');

// setup dev environment
require('./api/config/dev').setup(env);

// connect to database
require('./api/util/db');

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
