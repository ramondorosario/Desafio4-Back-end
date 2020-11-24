function response(ctx, status, dados) {
	ctx.status = status;
	ctx.body = {
		dados,
	};
}

module.exports = { response };
