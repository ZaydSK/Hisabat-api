const mongoose = require('mongoose');
const JOI = require('joi');


const customerSchema =  mongoose.Schema({
    name: {type:String, required: true},
    city: {type:String, required: true},
    paymentsBalance: {type:Number, required: true, default:0, min:0},
    billsBalance: {type:Number, required: true, default:0, min:0},
    returnsBalance: {type:Number, required: true, default:0, min:0},
});



const Customer = mongoose.model('Customer', customerSchema );

function validateCustomer(customer){
    const Schema = JOI.object({
        name: JOI.string().required(),
        city: JOI.string().required(),
        returnsBalance: JOI.number(),
        paymentsBalance: JOI.number(),
        billsBalance: JOI.number(),
    });
    return Schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
