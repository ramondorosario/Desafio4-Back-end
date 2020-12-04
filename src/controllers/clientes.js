/* eslint-disable no-else-return */
/* eslint-disable prettier/prettier */
const { response } = require('../utils/response');
const clientes = require('../repositories/clientes');
const cobrancas = require('../repositories/cobrancas');

async function criarCliente(ctx) {
	const {
		nome = null,
		cpf = null,
		email = null,
		tel = null,
	} = ctx.request.body;

	if (!nome || !cpf || !email || !tel)
		return response(
			ctx,
			400,
			'Requisição mal formatada. Todos os campos devem ser informados.'
		);

	const { usuarioId } = ctx.state;
	const existeCliente = await clientes.obterClientePorEmail(email, usuarioId);

	if (existeCliente)
		return response(ctx, 401, {
			menssagem: 'Já existe cliente cadastrado com esse email',
		});

	const cliente = await clientes.criarCliente(nome, cpf, email, tel, usuarioId);
	return response(ctx, 201, { id: cliente.id });
}

async function editarCliente(ctx) {
	const { id = null, nome = null, cpf = null, email = null } = ctx.request.body;

	if (!id || !nome || !cpf || !email)
		return response(ctx, 400, {
			menssagem:
				'Requisição mal formatada. Todos os campos devem ser informados',
		});

	const { usuarioId } = ctx.state;

	const existeCliente = await clientes.obterClientePorId(id, usuarioId);
	if (!existeCliente)
		return response(ctx, 404, { menssagem: 'Cliente não encontrado.' });

	const resultado = await clientes.editarCliente(id, nome, cpf, email);

	return response(ctx, 200, {
		id: resultado.id,
		nome: resultado.nome,
		cpf: resultado.cpf,
		email: resultado.email,
	});
}

async function listarClientes(ctx) {
	const { usuarioId } = ctx.state;
	const {
		clientesPorPagina = 10,
		offset = 0,
		busca = null,
	} = ctx.request.query;

	let resultado;
	let totalDeRegistros;

	if (!busca) {
		resultado = await clientes.obterClientes(
			usuarioId,
			offset,
			clientesPorPagina
		);
		totalDeRegistros = (await clientes.totalRegistroClientes(usuarioId)).length;
	} else {
		resultado = await clientes.obterClientesPorBusca(
			usuarioId,
			offset,
			clientesPorPagina,
			busca
		);
		totalDeRegistros = (
			await clientes.totalRegistroClientesPorBusca(usuarioId, busca)
		).length;
	}

	if (!resultado.length)
		return response(ctx, 404, {
			menssagem: 'Não foram encontrados clientes cadastrados',
		});

	const registroDeCobrancas = await cobrancas.registrosDeCobrancaComEmail(
		usuarioId
	);

	const dadosCliente = resultado.map((cliente) => {
		let cobrancasFeitas = 0;
		let cobrancasRecebidas = 0;
		let estaInadimplente = false;

		const cobrancasIndividual = registroDeCobrancas.filter(
			(item) => item.email === cliente.email
		);

		cobrancasIndividual.forEach((cobranca) => {
			cobrancasFeitas += cobranca.valor;
			if (cobranca.data_do_pagamento) {
				cobrancasRecebidas += cobranca.valor;
			} else if (
				!cobranca.data_do_pagamento &&
				+cobranca.vencimento < +new Date()
			) {
				estaInadimplente = true;
			}
		});

		return {
			id: cliente.id,
			nome: cliente.nome,
			email: cliente.email,
			tel: cliente.telefone,
			cobrancasFeitas,
			cobrancasRecebidas,
			estaInadimplente,
		};
	});

	return response(ctx, 200, {
		paginaAtual: Number(offset) / 10 + 1,
		totalDePaginas: Math.ceil(totalDeRegistros / clientesPorPagina),
		clientes: dadosCliente,
	});
}

module.exports = {
	criarCliente,
	editarCliente,
	listarClientes,
};
