const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());    // usar json para o body dos requests
app.use(routes);

app.listen(3333);