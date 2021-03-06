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

async function todasAsCobrancas(usuarioId) {
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
		select tabela1.*, tabela2.nome from (
			select * from cobrancas
			where cliente_id in (
				select id from clientes
				where usuario_id = $1
			)
		) as tabela1
		inner join (
			select id, nome from clientes
		) as tabela2
		on tabela1.cliente_id = tabela2.id
		offset $2 limit $3`,
		values: [usuarioId, offset, clientesPorPagina],
	};

	const resultado = await db.query(query);
	return resultado.rows;
}

async function listarCobrancasPorBusca(
	usuarioId,
	offset,
	clientesPorPagina,
	busca
) {
	const query = {
		text: `
		select tabela1.*, tabela2.nome  from (
			select * from cobrancas
			where cliente_id in (
				select id from clientes
				where usuario_id = $1
			)
		) as tabela1
		inner join (
			select * from clientes
			where (nome like $2 or email like $2 or cpf like $2)
		) as tabela2
		on tabela1.cliente_id = tabela2.id
		offset $3 limit $4`,
		values: [usuarioId, `%${busca}%`, offset, clientesPorPagina],
	};

	const resultado = await db.query(query);
	return resultado.rows;
}

async function registrosDeCobrancaComEmail(usuarioId) {
	const query = {
		text: `
		select tabela.*, clientes.email 
		from clientes
		inner join (
			select * from cobrancas
			where cliente_id in (
				select id from clientes
				where usuario_id = $1
			)
		) as tabela
		on clientes.id = tabela.cliente_id;
		`,
		values: [usuarioId],
	};

	const resultado = await db.query(query);
	return resultado.rows;
}

async function pagarCobranca(usuarioId, idCobranca) {
	const query = {
		text: `
		update cobrancas
		set data_do_pagamento = $1
		where cliente_id in (
			select id from clientes 
			where usuario_id = $2
		)
		and id = $3
		RETURNING *`,
		values: [new Date(), usuarioId, idCobranca],
	};

	const resultado = await db.query(query);
	return resultado.rows.shift();
}

module.exports = {
	cadastrarCobranca,
	todasAsCobrancas,
	listarCobrancas,
	listarCobrancasPorBusca,
	registrosDeCobrancaComEmail,
	pagarCobranca,
};
