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

module.exports = { criarCliente, editarCliente };
