const db = require('../utils/database');

async function criarCliente(nome, cpf, email, tel, usuarioId) {
	const query = {
		text: `INSERT INTO clientes (nome, cpf, email, telefone, usuario_id) VALUES ($1, $2, $3, $4, $5) RETURNING*`,
		values: [nome, cpf, email, tel, usuarioId],
	};

	const resultado = await db.query(query);

	return resultado.rows.shift();
}

async function obterClientePorId(id, usuarioId) {
	const query = {
		text: `SELECT * FROM clientes WHERE id = $1 AND usuario_id = $2`,
		values: [id, usuarioId],
	};

	const resultado = await db.query(query);
	return resultado.rows.shift();
}

async function obterClientePorEmail(email, usuarioId) {
	const query = {
		text: `SELECT * FROM clientes WHERE email = $1 AND usuario_id = $2`,
		values: [email, usuarioId],
	};

	const resultado = await db.query(query);
	return resultado.rows.shift();
}

async function editarCliente(id, nome, cpf, email) {
	const query = {
		text: `UPDATE clientes SET nome = $1, cpf = $2, email = $3 WHERE id = $4 RETURNING*`,
		values: [nome, cpf, email, id],
	};

	const resultado = await db.query(query);

	return resultado.rows.shift();
}

async function obterClientes(usuarioId, offset, clientesPorPagina) {
	const query = {
		text: `SELECT * FROM clientes WHERE usuario_id = $1 OFFSET $2::int LIMIT $3::int`,
		values: [usuarioId, offset, clientesPorPagina],
	};

	const resultado = await db.query(query);
	return resultado.rows;
}

async function obterClientesPorBusca(
	usuarioId,
	offset,
	clientesPorPagina,
	busca
) {
	const query = {
		text: `
		select * from clientes 
		where usuario_id = $1
		and ( nome like $2 or email like $2 or cpf like $2)
		offset $3 limit $4;
		`,
		values: [usuarioId, `%${busca}%`, offset, clientesPorPagina],
	};

	const resultado = await db.query(query);
	return resultado.rows;
}

module.exports = {
	criarCliente,
	obterClientePorId,
	obterClientePorEmail,
	editarCliente,
	obterClientes,
	obterClientesPorBusca,
};
