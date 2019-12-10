import socketIoClient from 'socket.io-client';
import SocketWrapper  from './socket-wrapper';
import TpBase         from './base';

class TpClient extends TpBase {
	/**
	 * @param {{
	 *   address: string
	 *   role: string
	 *   name: string
	 * }} props
	 */

	constructor(props) {
		super();
		this.socket = socketIoClient(props?.address);
		this.role = props?.role || '';
		this.name = props?.name || '';
		this.tpSock = new SocketWrapper(this.socket, this.socketRequestHandler.bind(this));
		this.registeredRequests = {};
	}

	async ready() {
		await new Promise((resolve, reject) => {
			this.emitter.once('connected', resolve);
		});
	}

	async emit(event, ...args) {
		return await this.tpSock.send(event, args);
	}
}

export default TpClient;