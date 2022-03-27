const { application } = require('express');
const express = require('express');
const customers = require('./routes/customers');
const bills = require('./routes/bills');
const products = require('./routes/products');
const payments = require('./routes/payments');
const returns = require('./routes/returns');
const balances = require('./routes/balances');


require('./start/db')();
const app = express();

app.use(express.json());
app.use('/customers',customers);
app.use('/bills', bills);
app.use('/products', products);
app.use('/payments', payments);
app.use('/returns', returns);
app.use('/balances', balances);







const port = process.env.PORT || 3000;
app.listen(port);

