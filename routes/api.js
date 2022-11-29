const router = require('express').Router();


router.use('/products', require('./api/products'))
router.use('/clients', require('./api/clients'))


module.exports = router;