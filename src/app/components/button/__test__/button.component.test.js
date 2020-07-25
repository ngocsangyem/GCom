import { buttonComponent } from '../button.component';

describe('buttonComponent View', function() {

	beforeEach(() => {
		this.button = new buttonComponent();
	});

	it('Should run a few assertions', () => {
		expect(this.button).to.exist;
	});

});