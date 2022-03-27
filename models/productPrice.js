const mongoose = require('mongoose');
const JOI = require('joi');
JOI.ObjectId = require('joi-objectid')(JOI);

const ProductPrice = mongoose.model('ProductPrice', new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId , ref:"Product", required: true},
    price: {type:Number, required: true, default:0, min:0},
    date: {type:Date, default:Date.now()} 
}) );

function validateProductPrice(product){
    const Schema = JOI.object({
        productId: JOI.ObjectId().required(),
        price: JOI.number().min(0).required(),
    });
    return Schema.validate(product);
}

exports.ProductPrice = ProductPrice;
exports.validate = validateProductPrice;
