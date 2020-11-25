const db = require('../utils/database');

async function criarUsuario(email, senha, nome) {
	const query = {
		text: `INSERT INTO usuarios (email, senha, nome) VALUES ($1, $2, $3) RETURNING*`,
		values: [email, senha, nome],
	};

	const resultado = await db.query(query);
	return resultado;
}

async function obterUsuarioPorEmail(email) {
	const query = {
		text: `SELECT * FROM usuarios WHERE email = $1`,
		values: [email],
	};

	const resultado = await db.query(query);
	return resultado.rows.shift();
}

module.exports = { criarUsuario, obterUsuarioPorEmail };
