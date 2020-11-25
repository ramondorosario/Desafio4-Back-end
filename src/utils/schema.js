/* eslint-disable no-unused-vars */
const db = require('./database');

const schema = [
	{
		1: `CREATE TABLE IF NOT EXISTS usuarios (
			id SERIAL,
			nome TEXT NOT NULL,
			email TEXT NOT NULL,
			senha TEXT NOT NULL,
			deletado BOOL DEFAULT FALSE
		)`,
	},
	{
		2: `CREATE TABLE IF NOT EXISTS clientes (
			id SERIAL,
			nome TEXT NOT NULL,
			email TEXT NOT NULL,
			cpf TEXT NOT NULL,
			telefone TEXT NOT NULL,
			usuario_id INT NOT NULL
		)`,
	},
	{
		3: `CREATE TABLE IF NOT EXISTS cobrancas (
			id SERIAL,
			valor INT NOT NULL,
			link_do_boleto TEXT NOT NULL,
			descricao TEXT NOT NULL,
			vencimento DATE NOT NULL,
			data_do_pagamento DATE NOT NULL,
			cliente_id INT NOT NULL
		)`,
	},
];

/**
 * Cria todas as tabelas;
 * Cria uma tabela em particular
 */
async function up(numero = 0) {
	if (!numero) {
		schema.forEach((table, i) => {
			db.query(table[i + 1]);
		});
		console.log('Tabelas criadas');
	} else {
		await db.query(schema[numero - 1][numero]);
		console.log('Tabela criada');
	}
}
// up();

/** Deleta a tabela escolhida */
async function dropTable(nomeDaTabela) {
	const query = `DROP TABLE ${nomeDaTabela}`;
	await db.query(query);
	console.log('Tabela deletada');
}

// dropTable();
