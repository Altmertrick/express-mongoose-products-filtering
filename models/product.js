const mongoose = require('mongoose');

//1 creating mongoose Schema
//Each schema maps to a MongoDB collection( 'tables' in relational dbs)
//and defines the shape of the documents within that collection.
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'product name must be provided'],
  },
  price: {
    type: Number,
    required: [true, 'product price must be provided'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: {
      values: ['ikea', 'liddy', 'caressa', 'marcos'],
      message: '{VALUE} is not supported',
    },
    //enum: ['ikea', 'liddy', 'carresa', 'marcos'],
  },
});

//2 creating Product model based on Schema
//Models are fancy constructors compiled from Schema definitions.
//An instance of a model is called a document.
// Models are responsible for creating and reading documents
//from the underlying MongoDB database.
const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;
