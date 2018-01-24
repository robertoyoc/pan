import Controller from '@ember/controller';

export default Controller.extend({

	actions: {
		delete(prima){
			prima.destroyRecord()
		}
	}
});
