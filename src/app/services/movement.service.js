
const movementRepository = require('../repositories/movement.repository')


const movementService = {
    getInvoice: async () => {
        return new Promise((resolve, reject) => {
                    var result =  movementRepository.getInvoice()
                    return resolve(result)
        })
    }
}

module.exports = movementService