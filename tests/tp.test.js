const tp = require('../build');
const {expect} = require('chai');
const {describe, it, after} = require('mocha');
const http = require('http');


let tpServer;
let tpServer2;
let tpClient;

describe('tp', () => {
	it('server is starting', async () => {
		tpServer = new tp.TpServer({
			server: http.createServer(),
		});

		tpServer.on('test simple', async function (arg) {
			if (this.meta.flag) return false;
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

	it('client can send with meta', async () => {
		const res = await tpClient.setMeta({flag: true}).emit('test simple', 10);
		expect(res).to.be.equal(false);
	});


	it('client can send once emitter', async () => {
		tpServer.once('test once', async function (arg) {
			return arg;
		});
		const testval = 'test-value';
		const result = await tpClient.emit('test once', testval);
		expect(result).to.be.equal(testval);
	});

	it('client can not send once once more', async () => {
		const testval = 'test-value';
		const result = await tpClient.emit('test once', testval);
		expect(result).to.deep.equal({error: 'System error #007'});
	});

	it('client can send once with meta', async () => {
		tpServer.once('test once', async function (arg) {
			return arg + this.meta.flag;
		});
		const testval = 'test-value';
		const meta = '1';
		const result = await tpClient.setMeta({flag: meta}).emit('test once', testval);
		expect(result).to.be.equal(testval + meta);
	});

	it('server can connect to another server', async () => {
		tpServer2 = new tp.TpServer({
			server: http.createServer()
		});
		await tpServer2.start(8902);
		await tpServer2.connect('http://localhost:8900', 'tp1');
	});

	it('server can emit', async () => {
		const testdata = 'test-data';
		const result = await tpServer2.connections.tp1.emit('test simple', testdata);
		expect(result).to.be.equal(testdata);
	});

	it('sever can emit with meta', async () => {
		const result = await tpServer2.connections.tp1.setMeta({flag: true}).emit('test simple', 10);
		expect(result).to.be.equal(false);
	});

	after(() => {
		setTimeout(() => {
			process.exit();
		}, 1000);
	});
});
