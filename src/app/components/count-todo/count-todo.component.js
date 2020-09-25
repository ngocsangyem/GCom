import Component from '../../store/lib/component';
import store from '../../store/index';

export default class CountTodo extends Component {
	constructor() {
		super({
			store,
			element: document.querySelector('.js-count'),
		});
	}

	/**
	 * React to state changes and render the component's HTML
	 *
	 * @returns {void}
	 */
	render() {
		let suffix = store.state.items.length !== 1 ? 's' : '';
		let emoji = store.state.items.length > 0 ? '🙌' : '😢';
		console.log(this);
		this.element.innerHTML = `
			<div class="count-todo__title">
				<small>You've done</small>
				<span>${store.state.items.length}</span>
				<small>thing${suffix} today ${emoji}</small>
			</div>
		`;
	}
}
