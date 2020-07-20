import { headerComponent } from '../header.component';

describe('headerComponent View', function() {

	beforeEach(() => {
		this.header = new headerComponent();
	});

	it('Should run a few assertions', () => {
		expect(this.header).to.exist;
	});

});