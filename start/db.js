const { func } = require("joi");
const { default: mongoose } = require("mongoose");
const config = require('config');
const Fawn = require('fawn');


module.exports = function(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>console.log('Connected...'))
    .catch((err)=>{console.log('Could not Connect',err);})
    //Fawn.init(config.get('dbConnectionString'));


}