const db = require('../utils/database');

async function cadastrarCobranca(
	valor,
	linkDoBoleto,
	descricao,
	vencimento,
	codigoDeBarra,
	clienteId
) {
	const query = {
		text: `INSERT INTO cobrancas (valor, link_do_boleto, descricao, vencimento, codigo_de_barra, cliente_id) values ($1, $2, $3, $4, $5, $6) RETURNING*`,
		values: [
			valor,
			linkDoBoleto,
			descricao,
			vencimento,
			codigoDeBarra,
			clienteId,
		],
	};

	const resultado = await db.query(query);
	return resultado.rows.shift();
}

module.exports = { cadastrarCobranca };
