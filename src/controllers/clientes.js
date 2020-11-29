/* eslint-disable no-else-return */
/* eslint-disable prettier/prettier */
const { response } = require('../utils/response');
const clientes = require('../repositories/clientes');

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

	if (!busca) {
		resultado = await clientes.obterClientes(
			usuarioId,
			offset,
			clientesPorPagina
		);
	} else {
		resultado = await clientes.obterClientesPorBusca(
			usuarioId,
			offset,
			clientesPorPagina,
			busca
		);
	}

	if (!resultado.length)
		return response(ctx, 404, {
			menssagem: 'Não foram encontrados clientes cadastrados',
		});

	const dadosCliente = resultado.map((cliente) => {
		return {
			nome: cliente.nome,
			email: cliente.email,
			cobrancasFeitas: 0,
			cobrancasRecebidas: 0,
			estaInadimplente: false,
		};
	});

	return response(ctx, 200, {
		paginaAtual: Number(offset) / 10 + 1,
		totalDePaginas: 10,
		clientes: dadosCliente,
	});
}

module.exports = {
	criarCliente,
	editarCliente,
	listarClientes,
};
