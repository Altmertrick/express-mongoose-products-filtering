const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ msg: 'hello world' });
});

const port = 5000;

app.listen(port, console.log(`Server listening on port ${port}...`));
