const { response } = require('../utils/response');
const clientes = require('../repositories/clientes');

async function criarCliente(ctx) {
	const {
		nome = null,
		cpf = null,
		email = null,
		telefone = null,
	} = ctx.request.body;

	if (!nome || !cpf || !email || !telefone)
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

	const cliente = await clientes.criarCliente(
		nome,
		cpf,
		email,
		telefone,
		usuarioId
	);
	return response(ctx, 201, { id: cliente.id });
}

module.exports = { criarCliente };
