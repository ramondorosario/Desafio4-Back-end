const { response } = require('../utils/response');
const clientes = require('../repositories/clientes');
const cobrancas = require('../repositories/cobrancas');
const gerarCobranca = require('../utils/pagarme');

async function criarCobranca(ctx) {
	const {
		idDoCliente = null,
		descricao = null,
		valor = null,
		vencimento = null,
	} = ctx.request.body;

	if (!idDoCliente || !descricao || !valor || !vencimento)
		return response(
			ctx,
			400,
			'Requisição mal formatada. Todos os campos devem ser informados'
		);

	const { usuarioId } = ctx.state;
	const cliente = await clientes.obterClientePorId(idDoCliente, usuarioId);
	if (!cliente)
		return response(ctx, 404, { menssagem: 'Cliente não encontrado' });

	const resultado = await gerarCobranca(ctx, cliente, valor, vencimento);
	if (!resultado)
		return response(ctx, 401, {
			menssagem:
				'Erro ao gerar boleto. Verifique se todos os dados informados são válidos',
		});

	const cobrancaCadastrada = await cobrancas.cadastrarCobranca(
		valor,
		resultado.data.boleto_url,
		descricao,
		vencimento,
		resultado.data.boleto_barcode,
		resultado.data.customer.external_id
	);

	if (!cobrancaCadastrada)
		return response(ctx, 401, { menssagem: 'Erro ao cadastrar o boleto' });

	return response(ctx, 201, {
		cobranca: {
			idDoCliente: cobrancaCadastrada.cliente_id,
			descricao: cobrancaCadastrada.descricao,
			valor: cobrancaCadastrada.valor,
			vencimento: cobrancaCadastrada.vencimento,
			linkDoBoleto: cobrancaCadastrada.link_do_boleto,
			codigoDeBarra: cobrancaCadastrada.codigo_de_barra,
			status: 'AGUARDANDO',
		},
	});
}

module.exports = { criarCobranca };
