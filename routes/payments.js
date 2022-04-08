const {Payment,validate} = require("../models/payment");
const {Customer} = require("../models/customer");
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const JOI = require("joi");
const Fawn = require('../start/fawn');


// all payments
router.post('/', async(req,res)=>{
    let dateTo = Date.now();
    let dateFrom = new Date('2000-01-01');
    if (req.body.from){
       dateFrom = new Date(req.body.from);
    }
    if (req.body.to){
        dateTo = new Date(req.body.to);
     }


    return  res.send(await Payment.find({date:{$gte:dateFrom, $lte:dateTo}}).sort({date:-1}));
});

// new payment
router.post('/new', async(req,res)=>{
    const {error} = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(404).send('The specified customer was not found');
    
    const payment = new Payment({
        customerId: customer._id,
        value: req.body.value
    });

    /*try{
        new Fawn.Task()
            .save('payments',payment)
            .update('customers', {_id:customer._id},{
                $inc:{paymentsBalance:payment.value}
            })
        .run();
        res.send(payment);
        } catch(ex){
            res.status(500).send("Failed");
        }*/

    // let result = await payment.save();
    // res.send(result);
    customer.paymentsBalance= customer.paymentsBalance + payment.value;
    await customer.save();
    let result = await payment.save();
    result = result.toJSON();
    result.customerName = customer.name;
    res.send(result);
    
});

module.exports = router;
