const app = require('../index');

const env = app.get('env');

// setup dev environment
require('../config/dev').setup(env);

// connect to database
require('../util/db');

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
