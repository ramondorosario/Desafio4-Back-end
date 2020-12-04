/* eslint-disable prettier/prettier */
const axios = require('axios').default;

require('dotenv').config();

async function gerarCobranca(ctx, cliente, valor, vencimento) {
	try {
		const resposta = await axios.post('https://api.pagar.me/1/transactions', {
			amount: valor,
			payment_method: 'boleto',
			boleto_expiration_date: vencimento,
			customer: {
				external_id: `${cliente.id}`,
				name: cliente.nome,
				email: cliente.email,
				type: 'individual',
				documents: [
					{
						type: 'cpf',
						number: cliente.cpf,
					},
				],
			},
			api_key: process.env.API_KEY,
		});

		return resposta;
	} catch (err) {
		return false;
	}
}

module.exports = gerarCobranca;
