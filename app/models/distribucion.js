import DS from 'ember-data';
import { computed } from "@ember/object";

export default DS.Model.extend({
	tipo: DS.attr('string'),
	productoId: DS.attr('string'),
	producto: computed('tipo', 'productoId', function(){
		return this.store.findRecord(this.get('tipo'), this.get('productoId'))
	}), 
	cantidad: DS.attr('number', { defaultValue: 1})
});
