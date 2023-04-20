const express = require('express')
const router = express.Router()

const { getInvoice } = require('../controllers/movement.controller')

router.get('/getInvoice', getInvoice)

module.exports = router