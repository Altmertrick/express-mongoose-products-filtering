const express = require('express');

const {
  getAllProductsStatic,
  getAllProducts,
} = require('../controllers/products');

const router = express.Router();

//base url: /api/v1/products/
router.get('/static', getAllProductsStatic);

router.get('/', getAllProducts);

module.exports = router;
