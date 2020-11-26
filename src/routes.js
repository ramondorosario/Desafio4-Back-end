const Router = require('koa-router');

// Controller
const Usuarios = require('./controllers/usuarios');
const Clientes = require('./controllers/clientes');
const Autenticar = require('./controllers/auth');

// Middleware
const Password = require('./middlewares/encrypt');
const Session = require('./middlewares/session');

const router = new Router();

router.post('/auth', Autenticar);

router.post('/usuarios', Password.encrypt, Usuarios.criarUsuario);
router.post('/clientes', Session.verify, Clientes.criarCliente);
router.put('/clientes', Session.verify, Clientes.editarCliente);

module.exports = router;
