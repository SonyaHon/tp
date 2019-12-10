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

tp.start(3000);
tp2.start(3002);

tp.on('test', async function() {
	return 'Hello world!';
});


(async () => {

})();