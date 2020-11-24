function response(ctx, status, data) {
	ctx.status = status;
	ctx.body = {
		status: status >= 200 && status <= 399 ? 'sucesso' : 'erro',
		data,
	};
}

module.exports = { response };
