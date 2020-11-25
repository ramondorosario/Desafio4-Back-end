function response(ctx, status, dados) {
	ctx.status = status;
	ctx.body = {
		status,
		dados,
	};
}

module.exports = { response };
