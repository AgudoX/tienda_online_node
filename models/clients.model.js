const { model, Schema } = require('mongoose');


const clientSchema = new Schema({
    name: String,
    email: String,
    address: String,
    age: Number,
    active: Boolean,
    products: [{ type: Schema.Types.ObjectId, ref: 'product' }]//Relaciona varios productos con 1 cliente, relación 1:N, si quito los corchetes del array la relación sería 1:1. 
})

module.exports = model('client', clientSchema)