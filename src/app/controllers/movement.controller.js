const movementService = require('../services/movement.service')

const getInvoice = async (req, res) => {
    const invoiceId = parseInt(req.params.invoiceId)
    return res.send(await movementService.getInvoice())
}

module.exports = { getInvoice }