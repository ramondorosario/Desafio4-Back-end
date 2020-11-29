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
						number: '323.835.190-73' /* Mudar cpf fixo para cliente.cpf */,
					},
				], // Foi gerado cpf valido para não ocorrer erro quando for utilizar numeros qualquer como cpf (isso fei feito para facilitar os testes)
			},
			api_key: process.env.API_KEY,
		});

		return resposta;
	} catch (err) {
		console.log('deu erro');
		return false;
	}
}

module.exports = gerarCobranca;
