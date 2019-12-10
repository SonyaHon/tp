class TpRouter {
	constructor() {
		this.connections = {};
	}

	addClient(props) {
		if(!this.connections[props.name]) this.connections[props.name] = {};
		if(!this.connections[props.name][props.role]) this.connections[props.name][props.role] = {};
		this.connections[props.name][props.role][props.id] = props.tpSock;
	}
}

export default TpRouter;