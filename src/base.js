import Events from 'events';
import nano   from 'nanoid';
import C      from './const';

class TpBase {
	constructor() {
		this.emitter = new Events();
		this.registeredRequests = {};
		this.socketRequestResolvers = [];
		this.middlewareBeforePacketBeenHandled = [];
		this.middlewareAfterPacketBeenHandled = [];
		this.id = nano();
		this.connectionInfo = {};

		this.addSocketRequestResolver({
			event:    C.TECH.QUERY.GET_INFO,
			resolver: (packet) => {
				setTimeout(() => this.emitter.emit('connected'), 1);

				return {
					id:   this.id,
					role: this.role,
					name: this.name,
				};
			},
		});
	}

	/**
	 *	Sets a constant listener to the event
	 *
	 * @param {string} event
	 * @param {function} handler
	 */
	on(event, handler) {
		this.registeredRequests[event] = handler;
	}

	/**
	 * Sets a one time listener to the event
	 *
	 * @param {string} event
	 * @param {function} handler
	 */
	once(event, handler) {
		this.registeredRequests[event] = async (...args) => {
			delete this.registeredRequests[event];
			return await handler(...args);
		};
	}

	/**
	 *
	 * Adds socket request resolver (needed to add custom tech event)
	 *
	 * @param {{
	 *   event: string,
	 *   resolver: function | any
	 * }} resolver
	 */
	addSocketRequestResolver(resolver) {
		this.socketRequestResolvers.push(resolver);
	}


	unshiftMiddlewareBeforePacketBeenHandled(middleware) {
		this.middlewareBeforePacketBeenHandled.unshift(middleware);
	}

	pushMiddlewareBeforePacketBeenHandled(middleware) {
		this.middlewareBeforePacketBeenHandled.push(middleware);
	}

	unshiftMiddlewareAfterPacketBeenHandled(middleware) {
		this.middlewareAfterPacketBeenHandled.unshift(middleware);
	}

	pushMiddlewareAfterPacketBeenHandled(middleware) {
		this.middlewareAfterPacketBeenHandled.push(middleware);
	}

	async socketRequestHandler(packet) {
		// socket request resolvers
		for(let i = 0; i < this.socketRequestResolvers.length; i++) {
			const resolver = this.socketRequestResolvers[i];
			if(packet.meta.event !== resolver.event) continue;
			return typeof resolver.resolver === 'function' ? await resolver.resolver(packet) : resolver.resolver;
		}

		if(this.registeredRequests[packet.meta.event]) {
			// before handle middleware
			for(let i = 0; i < this.middlewareBeforePacketBeenHandled.length; i++) {
				const middleware = this.middlewareBeforePacketBeenHandled[i];
				if((await middleware(packet)) === false) {
					return {error: C.TECH.ERROR.BLOCKED_BY_BEFORE_HANDLED_MW};
				}
			}

			let callback = this.registeredRequests[packet.meta.event];

			callback = callback.bind({
				meta: packet.meta,
			});

			const result = await callback(...packet.args);
			let stop = false;
			let returnResult = result;

			// after handle middleware
			for(let i = 0; i < this.middlewareAfterPacketBeenHandled.length; i++) {
				const middleware = this.middlewareAfterPacketBeenHandled[i];
				const mwResult = await middleware(packet, result, {
					stop:   () => stop = true,
					return: (value) => returnResult = value,
				});
				if(mwResult === false) return {error: C.TECH.ERROR.BLOCKED_BY_AFTER_HANDLED_MW};
				if(stop) break;
			}
			return returnResult;
		}
		return {error: C.TECH.ERROR.NO_METHOD};
	}
}

export default TpBase;