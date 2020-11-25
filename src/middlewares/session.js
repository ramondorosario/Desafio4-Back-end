const Jwt = require('jsonwebtoken');

const { response } = require('../utils/response');

require('dotenv').config();

async function verify(ctx, next) {
	try {
		const token = ctx.headers.authorization.split(' ')[1];
		const verification = await Jwt.verify(token, process.env.JWT_SECRET);

		ctx.state.usuarioId = verification.id;
		ctx.state.email = verification.email;
	} catch (erro) {
		return response(ctx, 403, { menssagem: 'Ação proibida' });
	}
	return next();
}

module.exports = { verify };
