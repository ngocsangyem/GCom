import { addClass } from '../../../helpers/DOM/addClass';

export default class AlertCard {
	alertCard = Array.from(document.querySelectorAll('.js-alert-card'));

	constructor() {
		this.handleAlertCards();
	}

	initAlertCard(card) {
		card.addEventListener('click', function (event) {
			if (event.target.closest('.js-alert-card__close-btn')) {
				addClass(card, 'is-hidden');
			}
		});
	}

	handleAlertCards() {
		const _self = this;
		if (this.alertCard.length > 0) {
			this.alertCard.forEach((card) => {
				(function (card) {
					_self.initAlertCard(card);
				})(card);
			});
		}
	}

	static init() {
		const alert_card = new AlertCard();
		return alert_card;
	}
}
