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
			telefone TEX NOT NULL,
			usuarioId INTEGER,
		)`,
	},
	{
		3: `CREATE TABLE IF NOT EXISTS cobrancas (
			id SERIAL,
			valor INT NOT NULL,
			linkDoBoleto TEXT NOT NULL,
			descricao TEXT NOT NULL,
			vencimento DATE NOT NULL,
			dataDoPagamento DATE NOT NULL,
			clienteId INT NOT NULL
		)`,
	},
];
