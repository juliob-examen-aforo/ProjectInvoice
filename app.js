require('dotenv').config()
const { Kafka } = require('kafkajs')
const { Pool } = require('pg')
require('dotenv').config()
const express = require('express')
const logProvider = require('./src/app/middlewares/logprovider')
const app = express()
const appPromise = require('./src/app/middlewares/configprovider').appPromise

appPromise.then(function(app) {
    const PORT = process.env.SERVER_PORT_INVOICE || 3002
    app.use('/api', require('./src/app/routes'))
    app.listen(PORT, () => {

        const pool = new Pool({
            user: process.env.DB_POSTGRES_USER,
            password: process.env.DB_POSTGRES_PASSWORD,
            database: process.env.DB_POSTGRES_DATABASE_INVOICE,
            host: process.env.DB_POSTGRES_HOST,
            port: process.env.DB_POSTGRES_PORT,
            ssl: { 
                rejectUnauthorized: !Boolean(process.env.DB_POSTGRES_REJECTUNAUTHORIZED),
            },
            dialect: process.env.DB_POSTGRES_DIALECT,
        })

        const kafka = new Kafka({
            clientId: 'transaction-client',
            brokers: [process.env.KAFKA_SERVER],
        })
        
        kafka_consumer()
        
        async function kafka_consumer() {
            const consumer = kafka.consumer({ groupId: 'invoice-subscription', allowAutoTopicCreation: true })
            await consumer.connect()
            await consumer.subscribe({ topic: 'transaction-topic', fromBeginning: true })
            await consumer.run({
                autoCommit: false,
                eachMessage: async ({ topic, partition, message }) => {
                    console.log({ value: message.value.toString() })
                    var jsonObj = JSON.parse(message.value.toString())
                   
        
                    await pool.query('insert into invoice (amount,state) values ($1,$2)', [jsonObj.amount, 1], async (err, result) => {
                        if (err) {
                            return console.error('Error executing query', err.stack)
                        }
                        logProvider.info(`1 document inserted in invoices amount ${jsonObj.amount}`, new Date());
                        await consumer.commitOffsets([{ topic, partition, offset: (Number(message.offset) + 1).toString() }]);                         
                    })
                },
            })
        }

        console.log('Application running on port ', PORT);

    })
});

