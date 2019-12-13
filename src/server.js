import SocketIoServer from 'socket.io';
import SocketWrapper from './socket-wrapper';
import C from './const';
import nano from 'nanoid';
import LoggerServer from './logger-server';
import TpRouter from './router';
import TpBase from './base';
import TpClient from './client';
import msgPackParser from 'socket.io-msgpack-parser';

class TpServer extends TpBase {

	/**
	 *
	 * @param {{
	 *   server: Object,
	 *   role: string,
	 *   name: string
	 * }} props
	 */
	constructor(props) {
		super();
		this.server = new SocketIoServer(props.server, {
			serveClient: false,
			parser     : msgPackParser
		});
		this.logger = new LoggerServer();
		this.id = nano();
		this.role = props?.role;
		this.name = props?.name;
		this.httpServer = props.server;
		this.router = new TpRouter();

		this.connections = {};

		this.server.on('connection', async (socket) => {
			const id = socket.id;
			let tpSock = new SocketWrapper(socket, this.socketRequestHandler.bind(this));
			try {
				const info = await tpSock.send(C.TECH.QUERY.GET_INFO, {
					id  : this.id,
					role: this.role,
					name: this.name,
				});
				this.router.addClient({
					...info,
					tpSock,
				});
			} catch (e) {
				this.logger.error(e.message);
				socket.close();
			}
		});
	}

	/**
	 *
	 * @param {number=3000} port
	 */
	async start(port = 3000) {
		await new Promise(resolve => this.httpServer.listen(port, resolve));
	}

	/**
	 *
	 * @param {string} address
	 * @param {string} name
	 * @returns {Promise<void>}
	 */
	async connect(address, name) {
		const connection = new TpClient({
			address,
			name: this.name,
			role: this.role,
		});
		await connection.ready();
		this.connections[name] = connection;
	}
}

export default TpServer;