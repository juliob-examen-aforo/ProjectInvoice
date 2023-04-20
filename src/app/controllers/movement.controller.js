const movementService = require('../services/movement.service')
const logProvider = require("../middlewares/logprovider");
const getInvoice = async (req, res) => {
    const invoices = await movementService.getInvoice();
    logProvider.info("Invoices Services", invoices);
    return res.send(invoices)
}

module.exports = { getInvoice }