const express = require('express');
const app = express();
app.use(express.json());

require('./start/db')();
require('./start/prod')(app);
require('./start/routes')(app);

const port = process.env.PORT || 3000;
app.listen(port);

