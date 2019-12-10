const tp = require('../build');
const {expect} = require('chai');
const {describe, it} = require('mocha');
const http = require('http');


let tpServer;
let tpServer2;
let tpClient;

describe('tp', () => {
	it('server is starting', async () => {
		tpServer = new tp.TpServer({
			server: http.createServer(),
		});

		tpServer.on('test simple', async (arg) => {
			return arg;
		});

		await tpServer.start(8900);
	});

	it('client can connect', async () => {
		tpClient = new tp.TpClient({
			address: 'http://localhost:8900'
		});
		await tpClient.ready();
	});

	it('client can send data', async () => {
		let testData = 'test-data';
		const result = await tpClient.emit('test simple', testData);
		expect(result).to.be.equal(testData);
	});

});
