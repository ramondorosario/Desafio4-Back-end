const { response } = require('../utils/response');
const password = require('../utils/password');

async function encrypt(ctx, next) {
	const { senha = null } = ctx.request.body;
	if (senha) {
		const hash = await password.encrypt(senha);
		ctx.state.hash = hash;
	} else {
		response(ctx, 400, {
			menssagem: 'Requisição mal formata. A senha deve ser informada',
		});
	}

	return next();
}

module.exports = { encrypt };
