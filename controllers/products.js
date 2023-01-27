const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const { company, name, price, sort, fields } = req.query;

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
    console.log(sort);
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

  const products = await result;

  res.status(200).json({ products, amount: products.length });
};

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
  const products = await result;

  res.status(200).json({ products, amount: products.length });
};

module.exports = { getAllProductsStatic, getAllProducts };
