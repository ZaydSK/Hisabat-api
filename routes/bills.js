const {Bill,validate} = require("../models/bill");
const {Product} = require("../models/product");
const {Customer} = require("../models/customer");
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const JOI = require("joi");
const Fawn = require('../start/fawn');
const { date } = require("joi");
// all bills
router.post('/', async(req,res)=>{
    let dateTo = Date.now();
    let dateFrom = new Date('2000-01-01');
    if (req.body.from){
       dateFrom = new Date(req.body.from);
    }
    if (req.body.to){
        dateTo = new Date(req.body.to);
     }

    
    let bills =(await Bill.find({date:{$gte:dateFrom, $lte:dateTo}}).sort({date:-1}));
    res.send(await Promise.all( bills.map(async bill=>{
        let temp = bill.toJSON();
        temp.customer = await Customer.findById(temp.customerId,'name -_id');
        temp.product = await Product.findById(temp.productId,'name -_id');
        return temp;
    })
    ));
    
    
});

// new bill
router.post('/new', async(req,res)=>{
    const {error} = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(404).send('The specified customer was not found');
    const product = await Product.findOne({productId:req.body.productId});
    if(!product) return res.status(404).send('The specified product was not found');

    const bill = new Bill({
        customerId: customer._id,
        productId:req.body.productId,
        amount: req.body.amount,
        price: req.body.price,
        date: Date.now()
    });

    customer.billsBalance= customer.billsBalance + bill.price;
    await customer.save();
    let result = await bill.save();
    result = result.toJSON();
    result.customerName = customer.name;
    res.send(result);
    
});

module.exports = router;
