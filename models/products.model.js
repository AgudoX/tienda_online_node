const { model, Schema } = require('mongoose');

//Esto serán los campitos que tendrán los productos, cada campo tiene un tipo, muchos son parecidos a los de js pero con la primera mayúscula.
const productSchema = new Schema({
    name: String,
    description: String,
    category: String,
    price: Number,
    available: Boolean,
    stock: Number,
    image: String
})

module.exports = model('product', productSchema) //model() relaciona 'product' con el schema que le asignemos, en este caso productSchema.
//Esto crea en mongo un product en plural, en este caso products, este products es el equivalente a table en mysql.