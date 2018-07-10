import Route from '@ember/routing/route';
import moment from 'moment';

export default Route.extend({

	beforeModel(){
		/*
		this.store.createRecord('roll-call', {
			fecha: moment(),
			turno: "Vespertino"
		}).save()
		*/
	}

});
