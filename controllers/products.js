const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const { company, name, price, sort, fields } = req.query;

  //use query object filter to find documents by fields' values
  const queryOject = {};
  if (company) {
    queryOject.company = company;
  }
  if (name) {
    //using mongo db query operator regex for a filter
    queryOject.name = { $regex: name, $options: 'i' };
  }
  if (price) {
    queryOject.price = Number(price);
  }

  let result = Product.find(queryOject);
  //Sort
  if (sort) {
    // ...api/v1/products?sort=price,-name
    // 'price,-name,date' => 'price -name date'
    // result.sort('price -name') or sort({price: 1, name: -1})
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }

  //Select - returns documents with specific fields
  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  //Pagination - implementing pagination using skip and limit methods
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;

  res.status(200).json({ amount: products.length, products });
};

/////

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields } = req.query;

  const queryParams = {};

  if (featured) {
    queryParams.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryParams.company = company;
  }
  if (name) {
    queryParams.name = { $regex: name, $options: 'i' };
  }

  let result = Product.find(queryParams);
  //Sort
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }
  //Select
  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  //Pagination
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;

  res.status(200).json({ amount: products.length, products });
};

module.exports = { getAllProductsStatic, getAllProducts };
