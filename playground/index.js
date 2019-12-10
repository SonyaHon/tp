const Tp = require('../build/index');
const http = require('http');

const httpServer = http.createServer();
const httpServer2 = http.createServer();

const tp = new Tp.TpServer({
	server: httpServer,
});

const tp2 = new Tp.TpServer({
	server: httpServer2,
});

tp.start(8000);
tp2.start(8002);

tp.on('test', async function (arg) {
	return arg;
});


(async () => {
	await tp2.connect('http://localhost:8000', 'tp');
	let res = await tp2.connections.tp.emit('test', 22);
	console.log(res);
})();