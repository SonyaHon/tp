import socketIoClient from 'socket.io-client';
import SocketWrapper from './socket-wrapper';
import TpBase from './base';
import msgPackParser from 'socket.io-msgpack-parser';

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
		this.socket = socketIoClient(props?.address, {
			parser: msgPackParser
		});
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
		return await this.tpSock.send(event, ...args);
	}

	setMeta(meta) {
		this.tpSock.setMeta(meta);
		return this;
	}

}

export default TpClient;