const redis = require('redis')
const movementRepository = require('../repositories/movement.repository')

const client = redis.createClient({
    url: process.env.DB_REDIS_URL,
    tls: {
        rejectUnauthorized: false
    },
    legacyMode: true
})
client.connect();
client.on('error', function (err) {
    console.log('Error ' + err)
})

const movementService = {
    getInvoice: async () => {
        return new Promise((resolve, reject) => {
                    var result =  movementRepository.getInvoice()
                    return resolve(result)
        })
    }
}

module.exports = movementService