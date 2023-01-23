require('dotenv').config();

const express = require('express');
const app = express();

const connectDB = require('./db/connect');

const errorHandlerMiddleware = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//routes
app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products" >Products route</a>');
});

//products routes

app.get('/api/v1/products', (req, res) => {
  res.send('Products');
});

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
