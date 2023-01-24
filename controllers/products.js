const getAllProductsStatic = async (req, res) => {
  throw new Error();
  res.status(200).json({ data: 'testing products route' });
};

const getAllProducts = async (req, res) => {
  res.status(200).json({ data: 'all products' });
};

module.exports = { getAllProductsStatic, getAllProducts };
