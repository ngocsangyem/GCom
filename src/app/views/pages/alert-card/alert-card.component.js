import AlertCard from '../../../components/card/alert-card/alert-card.component';

export class alertCardComponent {
	constructor() {
		AlertCard.init();
	}
	static init() {
		const alert_card = new alertCardComponent();
		return alert_card;
	}
}
(function () {
	alertCardComponent.init();
})();
