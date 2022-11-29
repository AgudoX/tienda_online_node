const router = require('express').Router();
const Product = require('../../models/products.model');


router.get('/', async (req, res) => {
    try {
        //devuelve una promesa
        const products = await Product.find(); //.find() es un método que recuperá todos los productos, en la consola de mongo también funciona este método.

        res.json(products);
    } catch (error) {
        res.json({ espabila: error.message })
    }


})


router.get('/available', async (req, res) => {
    try {
        //Me devuelve los productos con la propiedad available en true
        const products = await Product.find({ available: true });
        res.json(products)

    } catch (error) {
        res.json({ espabila: error.message })
    }
})

router.get('/min/:min/max/:max', async (req, res) => {
    try {
        //Me devuelve los productos cuyo precio está entre req.params.max y req.params.min
        const response = await Product.find({
            //Para encadenar operadores en mongoose lo hacemos como si cada condición fuera una propiedad del objeto que posee las condiciones.
            price: {
                $gt: req.params.min,
                $lt: req.params.max
            }
        });
        res.json(response)

    } catch (error) {
        res.json({ espabila: error.message })
    }
})

router.get('/min/:price', async (req, res) => {
    try {
        //Me devuelve los productos cuyo precio sea mayor que lo que se le pase por req.params.price
        const response = await Product.find({
            //$gt = greater than, $gte, $lt, $lte, $in, $nin

            price: { $gt: req.params.price }
        });
        res.json(response)

    } catch (error) {
        res.json({ espabila: error.message })
    }
})


router.get('/cat/:category', async (req, res) => {
    try {
        const { category } = req.params
        //Me devuelve los productos con la propiedad category igual a la parte variable de la petición get que hay en peticiones.rest
        const response = await Product.find({ category: category })
        res.json(response)

    } catch (error) {
        res.json({ espabila: error.message })
    }
})

router.get('/stock/:stock', async (req, res) => {
    try {
        const { stock } = req.params

        //Recuperamos todos los productos con stock mayor al número que pasamos a través de la UTL y que esten disponibles.
        const product = await Product.find({
            available: true,
            stock: { $gt: stock }
        }
        )
        res.json(product)

    } catch (error) {

    }

})

router.get('/:productId', async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    res.json(product)
})

router.post('/', async (req, res) => {
    //El req.body es el new product que hemos creado en el test.
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
})

router.put('/:productID', async (req, res) => {
    const productUp = await Product.findByIdAndUpdate(req.params.productID, req.body //Los parámetros que se actualizan
        , { new: true }); //El new true es para que te devuelva el producto ya actualizado
    console.log(productUp);
    res.json(productUp)
})

router.delete('/:productId', async (req, res) => {
    Product.findByIdAndDelete(req.params.productId, { new: true });

    res.json('')
})

module.exports = router;