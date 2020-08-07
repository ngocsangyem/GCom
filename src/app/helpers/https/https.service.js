// https://gist.github.com/paulsturgess/ebfae1d1ac1779f18487d3dee80d1258

import axios from 'axios';

class Https {
	constructor() {
		const service = axios.create({
			headers: { csrf: 'token' },
		});
		service.interceptors.response.use(this.handleSuccess, this.handleError);
		this.service = service;
	}

	handleSuccess(response) {
		return response;
	}

	handleError = (error) => {
		switch (error.response.status) {
			case 401:
				this.redirectTo(document, '/');
				break;
			case 404:
				this.redirectTo(document, '/404');
				break;
			default:
				this.redirectTo(document, '/500');
				break;
		}
		return Promise.reject(error);
	};

	redirectTo = (document, path) => {
		document.location = path;
	};

	async get(path, callback) {
		const response = await this.service.get(path);
		return callback(response.status, response.data);
	}

	async patch(path, payload, callback) {
		const response = await this.service.request({
			method: 'PATCH',
			url: path,
			responseType: 'json',
			data: payload,
		});
		return callback(response.status, response.data);
	}

	async post(path, payload, callback) {
		const response = await this.service.request({
			method: 'POST',
			url: path,
			responseType: 'json',
			data: payload,
		});
		return callback(response.status, response.data);
	}
}

export default new Https();
