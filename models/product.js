const mongoose = require('mongoose');
const JOI = require('joi');

const Product = mongoose.model('Product', new mongoose.Schema({
    name: {type:String, required: true},
    price: {type:Number, required: true, default:0, min:0},
    
}) );

function validateProduct(product){
    const Schema = JOI.object({
        name: JOI.string().required(),
        price: JOI.number().min(0).required(),
    });
    return Schema.validate(product);
}

exports.Product = Product;
exports.validate = validateProduct;
