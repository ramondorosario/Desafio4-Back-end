const { Client } = require('pg');

require('dotenv').config();

const client = new Client({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	port: 5432,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
});

client
	.connect()
	.then(() => console.log('connected'))
	.catch((err) => console.error('connection error', err.stack));

module.exports = client;
