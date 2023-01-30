const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const { company, name, price, sort, fields, numericFilters } = req.query;

  //use query object filter to find documents by fields' values
  const queryObject = {};
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    //using mongo db query operator - regex for a filter
    queryObject.name = { $regex: name, $options: 'i' };
  }
  if (price) {
    queryObject.price = Number(price);
  }

  if (numericFilters) {
    //Numeric filters - allow user to get documents based on condition
    //api/v1/products?numericFilters=price>30,rating>=4
    //we need to format numericFilters to query object dynamically
    //numericFilters = 'price>20,rating>=3.5' to
    //queryObject = { price: {$lh: 30}, rating: {$gh: 4} }
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(>|>=|=|<|<=)\b/g;

    const filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    // console.log(1, numericFilters);
    // console.log('------');
    // console.log(2, filters);

    //options that has number values in our documents in db
    const options = ['price', 'rating'];

    filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
    console.log(queryObject);
  }

  let result = Product.find(queryObject);

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

  //Counting all products that match our filters
  //it is necessary to create pagination of front-end
  const count = await Product.countDocuments(queryObject);

  res
    .status(200)
    .json({ allMatchedItems: count, amount: products.length, products });
};

/////
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;

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

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(>|>=|=|<|<=)\b/g;
    const filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ['price', 'rating'];
    filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryParams[field] = { [operator]: Number(value) };
      }
    });
    console.log(queryParams);
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
  const allMatchedItems = await Product.countDocuments(queryParams);

  res.status(200).json({ allMatchedItems, amount: products.length, products });
};

module.exports = { getAllProductsStatic, getAllProducts };
