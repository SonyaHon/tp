const C = {
	TECH: {
		QUERY     : {
			GET_INFO: '$$-get-info-$$',
		},
		EVENTS    : {
			PACKET_INCOMING: '$$-packet-incoming-$$',
		},
		ERROR     : {
			NO_METHOD                   : 'System error #007',
			BLOCKED_BY_BEFORE_HANDLED_MW: 'System error #008',
			BLOCKED_BY_AFTER_HANDLED_MW : 'System error #009',
			NO_ERROR_FUNCTION_IN_HANDLER: 'You cannot use arrow functions in event handlers'
		},
		MIDDLEWARE: {
			MIDDLEWARE_INC: 'MIDDLEWARE_INC',
		},
	},
};

export default C;