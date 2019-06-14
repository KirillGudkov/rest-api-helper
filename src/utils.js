const APPLICATION_JSON = 'application/json';
const TEXT_PLAIN = 'text/plain';

export function copyObject(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function getValue(key, value) {
	return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
}

export function getQueryParameters(body) {
	if (!body) {
		return '';
	}
	let res = '';
	const parameters = Object.keys(body);
	for (let i = 0; i < parameters.length; ++i) {
		const parameterName = parameters[i];
		if (body[parameterName] !== undefined) {
			res += `${res.length === 0 ? '?' : '&'}${getValue(parameterName, body[parameterName])}`;
		}
	}
	return res;
}

export function getFormURLEncodedBody(body) {
	function bodyToPropertiesArray(body, prefix = '') {
		let formBody = [];
		for (const property in body) {
			if (body.hasOwnProperty(property)) {
				const key = prefix ? `${prefix}[${property}]` : property;
				const encodedKey = encodeURIComponent(key);
				switch (typeof body[property]) {
					case "object":
						if (Array.isArray(body[property])) {
							body[property].each((val) => {
								const encodedValue = encodeURIComponent(val);
								formBody.push(encodedKey + "[]=" + encodedValue);
							}, this);
						}
						else {
							formBody = formBody.concat(bodyToPropertiesArray(body[property], property));
						}

					case 'function':
						break;
					case 'undefined':
						break;
					default:
						const encodedValue = encodeURIComponent(body[property]);
						formBody.push(encodedKey + "=" + encodedValue);
				}
			}
		}
		return formBody;
	}

	return bodyToPropertiesArray(body).join("&");
}

export function isTextPlain(headers) {
	return (headers['content-type'].toLowerCase()).indexOf(TEXT_PLAIN) !== -1
}

export function isApplicationJson(headers) {
	return (headers['content-type'].toLowerCase()).indexOf(APPLICATION_JSON) !== -1;
}

export function isBodyNotAllowed(method) {
	const lowerCaseMethod = method.toLowerCase();
	return lowerCaseMethod === 'get' || lowerCaseMethod === 'head';
}
