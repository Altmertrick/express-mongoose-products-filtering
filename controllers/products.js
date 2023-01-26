const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find(req.query);
  res.status(200).json({ products, amount: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name } = req.query;

  const queryParams = {};

  if (featured) {
    queryParams.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryParams.company = company;
  }
  if (name) {
    //using mongo db query operator regex for a filter
    queryParams.name = { $regex: name, $options: 'i' };
  }

  const products = await Product.find(queryParams);

  res.status(200).json({ products, amount: products.length });
};

module.exports = { getAllProductsStatic, getAllProducts };
