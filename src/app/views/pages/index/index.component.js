import store from '../../../store/index';

import CountTodo from '../../../components/count-todo/count-todo.component';
import StatusTodo from '../../../components/status-todo/status-todo.component';
import Todos from '../../../components/todos/todos.component';

export class IndexComponent {
	formElement = document.querySelector('.js-form');
	inputElement = document.querySelector('#add-new');

	constructor() {
		this.formHandle();
	}

	formHandle() {
		const self = this;
		this.formElement.addEventListener('submit', (event) => {
			event.preventDefault();
			const value = this.inputElement.value.trim();

			if (value !== '') {
				store.dispatch('addItem', value);
				self.inputElement.value = '';
				self.inputElement.focus();
			}
		});

		const countInstance = new CountTodo();
		const statusInstance = new StatusTodo();
		const listInstance = new Todos();

		// Initial renders
		countInstance.render();
		listInstance.render();
		statusInstance.render();
	}

	static init() {
		const index = new IndexComponent();
		return index;
	}
}
(function () {
	IndexComponent.init();
})();
