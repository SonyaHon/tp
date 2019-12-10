class Packet {
	constructor(props) {
		this.id = props.id;
		this.meta = props.meta;
		this.args = props.args;
		this.data = props.data;
	}


	serialize() {
		return JSON.stringify({
			id:   this.id,
			meta: this.meta,
			args: this.args,
			data: this.data,
		});
	}

	static fromSerialized(serialized) {
		return new Packet(JSON.parse(serialized));
	}
}

export default Packet;