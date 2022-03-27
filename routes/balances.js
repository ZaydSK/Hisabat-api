const {Customer} = require("../models/customer");
const {Bill} = require("../models/bill");

const express = require('express');
const router = express.Router();

// total all customers
router.post('/', async(req,res)=>{
  let customers =await  Customer.aggregate([{
    $group: {
        _id: '',
        billsBalance: { $sum: '$billsBalance' },
        returnsBalance: { $sum: '$returnsBalance' },
        paymentsBalance: { $sum: '$paymentsBalance' }
    }
  }
]);
  res.send(customers)
});


module.exports = router;
