const {Customer,validate} = require("../models/customer");
const {Payment} = require("../models/payment");
const {Return} = require("../models/return");
const {Bill} = require("../models/bill");
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const JOI = require("joi");
const { Product } = require("../models/product");

// all customers
router.get('/', async(req,res)=>{
    return  res.send(await Customer.find().sort({date:1}));
});

// add customers
router.post('/', async(req,res)=>{
    const {error} = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const customer = new Customer({
        name:req.body.name,
        city:req.body.city,
        paymentsBalance: req.body.paymentsBalance,
        billsBalance: req.body.billsBalance,
        returnsBalance: req.body.returnsBalance
    });
    let result = await customer.save();
    res.send(result);
    
});

// find customer
router.post('/search', async (req,res)=>{
    const {error} = validateSearch(req.body);
    if(error){ return res.status(400).send(error.details[0].message);}
    //console.log("Body",error);
    let customers = await Customer.find({name: {$regex: '.*'+req.body.name+'.*'} });
    if(!customers.length){return res.status(404).send("No matching customers were found");}
    res.send(customers);
    
})

// get all processes
router.get('/:id', async(req,res)=>{
    let bills = await Bill.find({customerId:req.params.id});
    let payments = await Payment.find({customerId:req.params.id});
    let returns = await Return.find({customerId:req.params.id});
    bills = await Promise.all( bills.map(async bill=>{
        let temp = bill.toJSON();
        temp.customer = await Customer.findById(temp.customerId,'name -_id');
        temp.product = await Product.findById(temp.productId,'name -_id');
        return temp;
    }));
    payments = await Promise.all( payments.map(async payment=>{
        let temp = payment.toJSON();
        temp.customer = await Customer.findById(temp.customerId,'name -_id');
        return temp;
    }));
    returns = await Promise.all( returns.map(async returned=>{
        let temp = returned.toJSON();
        temp.customer = await Customer.findById(temp.customerId,'name -_id');
        return temp;
    }));
        
    let result =[];
    result =result.concat(bills,payments,returns);
    result.sort(( a, b ) =>{
        if ( a.date < b.date ){
          return 1;
        }
        if ( a.date > b.date ){
          return -1;
        }
        return 0;
      })
    res.send(result);


})


function validateSearch(input){
    const Schema = JOI.object({
        name: JOI.string().required(),
    });
    console.log(Schema);
    return Schema.validate(input);
}

module.exports = router;
