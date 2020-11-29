/* eslint-disable prettier/prettier */
/* eslint-disable no-plusplus */

const { response } = require('../utils/response');
const clientes = require('../repositories/clientes');
const cobrancas = require('../repositories/cobrancas');

async function obterRelatorio(ctx) {
	const { usuarioId } = ctx.state;

	const listaDeClientes = await clientes.totalRegistroClientes(usuarioId);
	const todasAsCobrancas = await cobrancas.todasAsCobrancas(usuarioId);

	if (!listaDeClientes || !todasAsCobrancas)
		return response(ctx, 404, {
			mensagem: 'Não existem clientes ou cobranças cadastradas',
		});

	const relatorio = {
		qtdClientesAdimplentes: 0,
		qtdClientesInadimplentes: 0,
		qtdCobrancasPrevistas: 0,
		qtdCobrancasPagas: 0,
		qtdCobrancasVencidas: 0,
		saldoEmConta: 0,
	};

	listaDeClientes.forEach((cliente) => {
		let clienteDevendo = false;
		const cobrancasIndividual = todasAsCobrancas.filter(
			(item) => item.cliente_id === cliente.id
		);

		cobrancasIndividual.forEach((cobranca) => {
			if (!cobranca.data_do_pagamento && +cobranca.vencimento > +new Date()) {
				relatorio.qtdCobrancasPrevistas++;
			} else if (cobranca.data_do_pagamento) {
				relatorio.saldoEmConta += cobranca.valor;
				relatorio.qtdCobrancasPagas++;
			} else {
				relatorio.qtdCobrancasVencidas++;

				if (!clienteDevendo) relatorio.qtdClientesInadimplentes++;
				clienteDevendo = true;
			}
		});

		if (!clienteDevendo) relatorio.qtdClientesAdimplentes++;
	});

	return response(ctx, 200, { relatorio });
}

module.exports = { obterRelatorio };
