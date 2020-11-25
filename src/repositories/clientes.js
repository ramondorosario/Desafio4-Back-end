const db = require('../utils/database');

async function criarCliente(nome, cpf, email, telefone) {
	const usuarioId = 1;
	const query = {
		text: `INSERT INTO clientes (nome, cpf, email, telefone, usuario_id) VALUES ($1, $2, $3, $4, $5) RETURNING*`,
		values: [nome, cpf, email, telefone, usuarioId],
	};

	const resultado = await db.query(query);

	return resultado.rows.shift();
}

async function obterClientePorEmail(email) {
	const query = {
		text: `SELECT * FROM clientes WHERE email = $1`,
		values: [email],
	};

	const resultado = await db.query(query);
	return resultado.rows.shift();
}

module.exports = { criarCliente, obterClientePorEmail };
