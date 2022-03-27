const mongoose = require('mongoose');
const JOI = require('joi');
JOI.objectId = require('joi-objectid')(JOI);

const Payment = mongoose.model('Payment', new mongoose.Schema({
    customerId: {type: mongoose.Schema.Types.ObjectId, ref:'Customer',required:true},
    value: {type:Number, required: true, default:0, min:0},
    date: {type:Date, default:Date.now()},
    type:{type:String, default: 'payment'}
    
}) );

function validatePayment(payment){
    const Schema = JOI.object({
        customerId: JOI.objectId().required(),
        value: JOI.number().min(0).required(),
    });
    return Schema.validate(payment);
}

exports.Payment = Payment;
exports.validate = validatePayment;
