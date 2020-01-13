const mongoose = require('mongoose');

mongoose.set('toObject', { getters: true });

const { DB_URL, NODE_ENV } = process.env;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    autoIndex: NODE_ENV === 'production' ? false : true
  })
  .catch(err => {
    console.error("couldn't connect to the database", err);
    process.exit(1);
  });

const db = mongoose.connection;

db.on('error', err => {
  console.log(err);
});

db.on('open', () => console.log('connected to the database'));
