const mongoose = require('mongoose');
const JOI = require('joi');
JOI.objectId = require('joi-objectid')(JOI);

const Return = mongoose.model('Return', new mongoose.Schema({
    customerId: {type: mongoose.Schema.Types.ObjectId, ref:'Customer',required:true},
    value: {type:Number, required: true, default:0, min:0},
    date: {type:Date, default:Date.now()},
    type:{type:String, default: 'return'}
    
}) );

function validateReturn(returned){
    const Schema = JOI.object({
        customerId: JOI.objectId().required(),
        value: JOI.number().min(0).required(),
    });
    return Schema.validate(returned);
}

exports.Return = Return;
exports.validate = validateReturn;
