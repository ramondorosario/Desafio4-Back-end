/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
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

async function listarCobrancas(ctx) {
	const { usuarioId } = ctx.state;
	const { cobrancasPorPagina = 10, offset = 0 } = ctx.query;

	const resultado = await cobrancas.listarCobrancas(
		usuarioId,
		Number(offset),
		cobrancasPorPagina
	);

	if (!resultado)
		return response(ctx, 404, {
			menssagem: 'Não existem cobranças cadastradas',
		});

	const listaDeCobrancas = resultado.map((x) => {
		let status = '';
		const { data_do_pagamento, codigo_de_barra, ...dadosCobranca } = x;

		if (!data_do_pagamento && +x.vencimento > +new Date()) {
			status = 'AGUARDANDO';
		} else if (data_do_pagamento) {
			status = 'PAGO';
		} else {
			status = 'VENCIDO';
		}
		return { ...dadosCobranca, status };
	});

	const totalDeRegistros = (await cobrancas.totalDeRegistros(usuarioId)).length;

	return response(ctx, 200, {
		paginaAtual: Number(offset) / 10 + 1,
		totalDePaginas: Math.ceil(totalDeRegistros / cobrancasPorPagina),
		cobrancas: listaDeCobrancas.map((x) => {
			return {
				id: x.id,
				idDoCliente: x.cliente_id,
				descricao: x.descricao,
				valor: x.valor,
				vencimento: x.vencimento,
				linkDoBoleto: x.link_do_boleto,
				status: x.status,
			};
		}),
	});
}

async function pagarCobranca(ctx) {
	const { usuarioId } = ctx.state;
	const { idDaCobranca } = ctx.request.body;

	if (!idDaCobranca)
		return response(ctx, 400, {
			menssagem: 'Requisição mal formatada. Id da cobrança deve ser informada',
		});

	const resultado = await cobrancas.pagarCobranca(usuarioId, idDaCobranca);

	if (!resultado)
		return response(ctx, 401, { menssagem: 'A cobrança não existe' });

	return response(ctx, 200, { menssagem: 'Cobrança paga com sucesso' });
}

module.exports = { criarCobranca, listarCobrancas, pagarCobranca };
