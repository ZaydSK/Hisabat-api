const {Product,validate} = require("../models/product");
const {ProductPrice} = require('../models/productPrice');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const JOI = require("joi");

// all products
router.get('/', async(req,res)=>{
    let products = await Product.find();
    products = await Promise.all( products.map(async product=>{
        const productPrice = await ProductPrice.findOne({productId:product._id},{},{sort:{date:-1}});
        let temp = product.toJSON();
        temp.price = productPrice;
        return temp;
        
    }));
    //console.log(products);
    res.send(products)
});

// one product
router.get('/:id', async(req,res)=>{
    const id = validateProductId(req.body);
    if(!id){return res.status(400).send("invalid ID");}
    let product = await Product.findById(req.params.id);
    if(!product) return res.status(404).send("Couldn't find product");
    const productPrice = await ProductPrice.findOne({productId:product._id},{},{sort:{date:-1}});
    product = product.toJSON();
    product.price = productPrice.price;
    res.send({price:product.price});
});

// new product
router.post('/', async(req,res)=>{
    const {error} = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const product = new Product({
        name:req.body.name,
        price:req.body.price
    });
    let result = await product.save();
    const productPrice = new ProductPrice({
        productId: result._id,
        price:req.body.price,
        date: Date.now()
    });
    result =await productPrice.save();
    res.send(result);
    
});

// find product
router.post('/search', async (req,res)=>{
    const {error} = validateSearch(req.body);
    if(error){ return res.status(400).send(error.details[0].message);}
    //console.log("Body",error);
    let product = await Product.find({name: {$regex: '.*'+req.body.name+'.*'} });
    if(!product.length){return res.status(404).send("No matching customers were found");}
    res.send(product);
    
})

// get prices for a product
router.get('/prices/:id', async(req,res)=>{
    const product = await Product.findById(req.params.id);
    if(!product)  return res.status(404).send('The specified product was not found');
    res.send(await ProductPrice.find({productId:product._id}).sort({date:-1}));
});

// add new price
router.post('/prices/:id', async(req,res)=>{
   const {error} = validatePrice(req.body);
   if(error){ return res.status(400).send(error.details[0].message);}
    const product = await Product.findById(req.params.id);
    if(!product) return res.status(404).send('The specified product was not found');
    console.log(product);
    const productPrice = new ProductPrice({
        productId: req.params.id,
        price:req.body.price,
        date: Date.now()
    });
    let result = await productPrice.save();
    res.send(result);
});



function validateSearch(input){
    const Schema = JOI.object({
        name: JOI.string().required(),
    });
    return Schema.validate(input);
}

function validateProductId(body){
    const schema = JOI.object({productId:JOI.objectId().required()});
    return schema.validate(body);
}

function validatePrice(input){
    const Schema = JOI.object({
        price: JOI.number().required(),
    });
    //console.log(Schema);
    return Schema.validate(input);
}

module.exports = router;
