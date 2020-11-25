const { response } = require('../utils/response');
const usuarios = require('../repositories/usuarios');

async function criarUsuario(ctx) {
	const senha = ctx.state.hash;
	const { email = null, nome = null } = ctx.request.body;

	if (!email || !senha || !nome)
		return response(ctx, 400, {
			messagem:
				'Requisição mal formatada. Todos os campos devem ser preenchidos',
		});

	const condicao = await usuarios.obterUsuarioPorEmail(email);
	if (condicao)
		return response(ctx, 401, {
			messagem: 'Email já cadastrado',
		});

	const resultado = await usuarios.criarUsuario(email, senha, nome);
	const usuario = resultado.rows.shift();

	return response(ctx, 201, { id: usuario.id });
}

module.exports = { criarUsuario };
