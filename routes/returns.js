const {Return,validate} = require("../models/return");
const {Customer} = require("../models/customer");
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('../start/fawn');

// all returns
router.post('/', async(req,res)=>{
    let dateTo = Date.now();
    let dateFrom = new Date('2000-01-01');
    if (req.body.from){
       dateFrom = new Date(req.body.from);
    }
    if (req.body.to){
        dateTo = new Date(req.body.to);
     }

    let returns = await Return.find({date:{$gte:dateFrom, $lte:dateTo}}).sort({date:-1});
    res.send(await Promise.all( returns.map(async returned=>{
        let temp = returned.toJSON();
        temp.customer = await Customer.findById(temp.customerId,'name -_id');
        return temp;
    })
    ));
});

// new return
router.post('/new', async(req,res)=>{
    const {error} = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(404).send('The specified customer was not found');

    const returned = new Return({
        customerId: customer._id,
        value: req.body.value,
        date: Date.now()
    });

    customer.returnsBalance= customer.returnsBalance + returned.value;
    await customer.save();
    let result = await returned.save();
    result = result.toJSON();
    result.customerName = customer.name;
    res.send(result);
    
});

module.exports = router;
