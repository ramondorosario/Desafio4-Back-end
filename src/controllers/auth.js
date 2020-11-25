const Jwt = require('jsonwebtoken');

const { response } = require('../utils/response');
const usuarios = require('../repositories/usuarios');
const password = require('../utils/password');

require('dotenv').config();

async function autenticar(ctx) {
	const { email = null, senha = null } = ctx.request.body;
	if (!email || !senha)
		return response(ctx, 400, {
			mensagem:
				'Requisição mal formatada. Todos os campos devem ser preenchidos.',
		});

	const usuario = await usuarios.obterUsuarioPorEmail(email);
	if (!usuario)
		return response(ctx, 404, { mensagem: 'Email ou senha inválido' });

	const autenticado = await password.check(senha, usuario.senha);
	if (!autenticado)
		return response(ctx, 401, { mensagem: 'Email ou senha inválido' });

	const token = await Jwt.sign(
		{
			id: usuario.id,
			email: usuario.email,
		},
		process.env.JWT_SECRET || 'desafio4',
		{ expiresIn: '1h' }
	);

	return response(ctx, 200, {
		menssagem: 'Usuário logado com sucesso!',
		token,
	});
}

module.exports = autenticar;
