import Coder from '../../bin/src/index';

class Packet {
	constructor(props) {
		this.id = props.id;
		this.meta = props.meta;
		this.args = props.args;
		this.data = props.data;
	}


	serialize() {
		return Coder.encode({
			id  : this.id,
			meta: this.meta,
			args: this.args,
			data: this.data,
		});
	}

	static fromSerialized(serialized) {
		return new Packet(Coder.decode(serialized));
	}
}

export default Packet;