const C = {
	TECH: {
		QUERY:      {
			GET_INFO: '$$-get-info-$$',
		},
		EVENTS:     {
			PACKET_INCOMING: '$$-packet-incoming-$$',
		},
		ERROR:      {
			NO_METHOD:                    'System error #007',
			BLOCKED_BY_BEFORE_HANDLED_MW: 'System error #008',
			BLOCKED_BY_AFTER_HANDLED_MW:  'System error #009',
		},
		MIDDLEWARE: {
			MIDDLEWARE_INC: 'MIDDLEWARE_INC',
		},
	},
};

export default C;