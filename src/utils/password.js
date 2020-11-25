const bcrypt = require('bcryptjs');

async function encrypt(senha) {
	const hash = await bcrypt.hash(senha, 10);
	return hash;
}

async function check(senha, hash) {
	const comparison = await bcrypt.compare(senha, hash);
	return comparison;
}

module.exports = { encrypt, check };
