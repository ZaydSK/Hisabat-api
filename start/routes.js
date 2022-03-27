
const customers = require('../routes/customers');
const bills = require('../routes/bills');
const products = require('../routes/products');
const payments = require('../routes/payments');
const returns = require('../routes/returns');
const balances = require('../routes/balances');

module.exports = function(app){
    app.use('/customers',customers);
    app.use('/bills', bills);
    app.use('/products', products);
    app.use('/payments', payments);
    app.use('/returns', returns);
    app.use('/balances', balances);
}