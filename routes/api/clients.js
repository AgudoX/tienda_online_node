const router = require('express').Router();
const Clients = require('../../models/clients.model')

router.get('/', async (req, res) => {
    try {
        // populate() Si hay una relación, en populate ponemos el nombre de la propiedad que relaciona clientes con productos y muestra todos los datos del mismo.
        const clientes = await Clients.find().populate('products');
        res.json(clientes)
    } catch (error) {
        res.json({ espabila: error.message })
    }
})

router.get('/:clientId/product/:productId', async (req, res) => {
    const { clientId, productId } = req.params;

    // Recupero el cliente
    const clientFound = await Clients.findById(clientId);

    //Agrego el producto al cliente
    clientFound.products.push(productId);
    //Guardo el cliente
    await clientFound.save(); //Sin el save no persiste en la base de datos el producto agregado.

    res.json('producto agregado');
})

router.post('/', async (req, res) => {
    try {
        const clientes = await Clients.create(req.body);
        res.json(clientes)
    } catch (error) {
        res.json({ espabila: error.message })
    }
})

router.put('/:productId', async (req, res) => {
    try {
        const { productId } = req.params
        const clientes = await Clients.findByIdAndUpdate(productId, { age: 77 }, { new: true });
        res.json(clientes)
    } catch (error) {
        res.json({ espabila: error.message })
    }
})


router.delete('/:productId', async (req, res) => {
    try {
        const { productId } = req.params
        const clientes = await Clients.findByIdAndDelete(productId, { new: true });
        res.json(clientes)
    } catch (error) {
        res.json({ espabila: error.message })
    }
})
module.exports = router;