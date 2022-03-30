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

    
    res.send (await Bill.find({date:{$gte:dateFrom, $lte:dateTo}}).sort({date:-1}));
    
    
});

// new bill
router.post('/new', async(req,res)=>{
    const {error} = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(404).send('The specified customer was not found');
    const product = await Product.findOne({productName:req.body.productName});
    if(!product) return res.status(404).send('The specified product was not found');
    const price = product.price * req.body.amount;

    const bill = new Bill({
        customerId: customer._id,
        productName:req.body.productName,
        amount: req.body.amount,
        value: req.body.value,
        price
    });

    /*try{
        new Fawn.Task()
            .save('bills',bill)
            .update('customers', {_id:customer._id},{
                $inc:{billsBalance:price}
            })
        .run();
        res.send(bill);
        } catch(ex){
            res.status(500).send(ex);
        }*/

    customer.billsBalance= customer.billsBalance + bill.value;
    let f=await customer.save();
    let result = await bill.save();
    res.send(f);
});

module.exports = router;
