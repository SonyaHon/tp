import nano   from 'nanoid';
import Packet from './packet';
import C      from './const';

class SocketWrapper {
	constructor(socket, handler) {
		this.socket = socket;
		this.handler = handler;

		this.socket.on(C.TECH.EVENTS.PACKET_INCOMING, this.processIncoming.bind(this));
	}

	async send(event, ...args) {
		const packetId = nano();
		const packet = new Packet({
			id:   packetId,
			meta: {
				event,
			},
			args: args,
			data: undefined,
		});

		return await new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				reject(new Error('Timeout error'));
			}, 1000);

			this.socket.once(packetId, (data) => {
				clearTimeout(timeout);
				const resPacket = Packet.fromSerialized(data);
				resolve(resPacket.data);
			});

			this.socket.emit(C.TECH.EVENTS.PACKET_INCOMING, packet.serialize());
		});
	}

	async processIncoming(data) {
		const incPacket = Packet.fromSerialized(data);
		const res = await this.handler(incPacket);
		const resPacket = new Packet({
			id:   incPacket.id,
			meta: {
				event: incPacket.meta.event,
			},
			args: [],
			data: res,
		});
		this.socket.emit(incPacket.id, resPacket.serialize());
	}
}

export default SocketWrapper;