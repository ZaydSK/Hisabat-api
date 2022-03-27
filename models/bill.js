const mongoose = require('mongoose');
const JOI = require('joi');
JOI.objectId = require('joi-objectid')(JOI);

const Bill = mongoose.model('Bill', new mongoose.Schema({
    customerId: {type: mongoose.Schema.Types.ObjectId, ref:'Customer',required:true},
    productName:  {type:String, required: true},
    amount : {type:Number , required:true, min:0},
    price: {type:Number, required: true, default:0, min:0},
    date: {type:Date , default: Date.now()},
    type:{type:String, default: 'bill'}
    
}) );

function validateBill(bill){
    const Schema = JOI.object({
        customerId: JOI.objectId().required(),
        productName: JOI.string().required(),
        amount: JOI.number().min(0).required(),
    });
    return Schema.validate(bill);
}

exports.Bill = Bill;
exports.validate = validateBill;
