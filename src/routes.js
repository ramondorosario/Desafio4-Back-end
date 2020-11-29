const Router = require('koa-router');

// Controller
const Usuarios = require('./controllers/usuarios');
const Clientes = require('./controllers/clientes');
const Cobrancas = require('./controllers/cobrancas');
const Autenticar = require('./controllers/auth');

// Middleware
const Password = require('./middlewares/encrypt');
const Session = require('./middlewares/session');

const router = new Router();

router.post('/auth', Autenticar);

router.post('/usuarios', Password.encrypt, Usuarios.criarUsuario);
router.post('/clientes', Session.verify, Clientes.criarCliente);
router.put('/clientes', Session.verify, Clientes.editarCliente);
router.get('/clientes', Session.verify, Clientes.listarClientes);
router.post('/cobrancas', Session.verify, Cobrancas.criarCobranca);
router.get('/cobrancas', Session.verify, Cobrancas.listarCobrancas);
router.put('/cobrancas', Session.verify, Cobrancas.pagarCobranca);

module.exports = router;
