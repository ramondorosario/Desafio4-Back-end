const db = require('../utils/database');

async function cadastrarCobranca(
	valor,
	linkDoBoleto,
	descricao,
	vencimento,
	codigoDeBarra,
	clienteId
) {
	const query = {
		text: `INSERT INTO cobrancas (valor, link_do_boleto, descricao, vencimento, codigo_de_barra, cliente_id) values ($1, $2, $3, $4, $5, $6) RETURNING*`,
		values: [
			valor,
			linkDoBoleto,
			descricao,
			vencimento,
			codigoDeBarra,
			clienteId,
		],
	};

	const resultado = await db.query(query);
	return resultado.rows.shift();
}

async function totalDeRegistros(usuarioId) {
	const query = {
		text: `
		select * from cobrancas
		where cliente_id in (
			select id from clientes
			where usuario_id = $1
		)
		`,
		values: [usuarioId],
	};

	const resultado = await db.query(query);
	return resultado.rows;
}

async function listarCobrancas(usuarioId, offset, clientesPorPagina) {
	const query = {
		text: `
			select * from cobrancas
			where cliente_id in (
				select id from clientes
				where usuario_id = $1
			)
			offset $2 limit $3;`,
		values: [usuarioId, offset, clientesPorPagina],
	};

	const resultado = await db.query(query);
	return resultado.rows;
}

module.exports = { cadastrarCobranca, totalDeRegistros, listarCobrancas };
