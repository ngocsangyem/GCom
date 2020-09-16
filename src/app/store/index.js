import actions from './actions.js';
import mutations from './mutations.js';
import state from './state.js';
import Store from './store';

export default new Store({
	actions,
	mutations,
	state,
});
