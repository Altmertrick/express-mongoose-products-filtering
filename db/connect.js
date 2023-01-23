const mongoose = require('mongoose');

const connectDB = (url) => {
  return mongoose
    .set({ strictQuery: true })
    .connect(url)
    .then(() => console.log('Connected to the DB...'))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
