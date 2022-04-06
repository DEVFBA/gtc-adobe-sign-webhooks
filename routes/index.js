const router = require('express').Router();
const logger = require('../Utils/logger');

router.get('/', (req, res)=>{
  res.send('Welcome to Polymex Portal Proveedores Webhooks API');
  logger.info("Welcome to Polymex Portal Proveedores Webhooks API");
});

//Webhooks Adobe Sign Routes
router.use('/webhooks', require('./webhooks'));

module.exports = router;